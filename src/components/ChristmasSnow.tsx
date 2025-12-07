import React, { useEffect, useState } from 'react';
import Snowfall from 'react-snowfall';
import { SEASONAL_CONFIG, isSeasonalActive } from '../config/seasonal';
import { useTheme } from './ThemeProvider';
import { SNOWFLAKE_DATA } from './snowflakePaths';

export function ChristmasSnow() {
    const isActive = isSeasonalActive();
    const { theme } = useTheme();

    // 1. Inject the specific Theme Class into body
    useEffect(() => {
        if (isActive) {
            document.body.classList.add(SEASONAL_CONFIG.themeName);
        } else {
            document.body.classList.remove(SEASONAL_CONFIG.themeName);
        }
        // Cleanup on unmount
        return () => document.body.classList.remove(SEASONAL_CONFIG.themeName);
    }, [isActive]);

    if (!isActive) return null;

    // White snow shows up best in dark mode; Icy Blue in light mode
    const snowColor = theme === 'dark' ? '#f1f5f9' : '#38bdf8';

    // 3. Interactive Wind Control
    const [wind, setWind] = useState<[number, number]>(SEASONAL_CONFIG.effects.wind);

    useEffect(() => {
        const handleMove = (clientX: number) => {
            // Normalize position from -1 (left) to 1 (right)
            const normalizedPos = (clientX / window.innerWidth) * 2 - 1;

            // Map to wind range: e.g., -1.0 to 1.5
            // Default wind was [-0.2, 1.0]. We want more variance.
            // Let's amplify it: Left -> -1.5, Right -> +2.0
            const windForce = normalizedPos * 1.5;

            // Add some randomness/variance to the tuple [min, max]
            setWind([windForce - 0.5, windForce + 0.5]);
        };

        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const onTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) handleMove(e.touches[0].clientX);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
        };
    }, []);

    // Load vector snowflakes
    const [snowflakeImages, setSnowflakeImages] = useState<HTMLImageElement[]>([]);

    useEffect(() => {
        const loadImages = async () => {
            const generateImage = (data: { path: string; viewBox: string }) => {
                return new Promise<HTMLImageElement>((resolve) => {
                    // Create an SVG blob for each path with the current theme color
                    const svgString = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="${data.viewBox}">
                            <path d="${data.path}" fill="${snowColor}" />
                        </svg>
                    `;
                    const blob = new Blob([svgString], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const img = new Image();
                    img.onload = () => {
                        URL.revokeObjectURL(url);
                        resolve(img);
                    };
                    img.src = url;
                });
            };

            const imagePromises = SNOWFLAKE_DATA.map(data => generateImage(data));
            const loadedImages = await Promise.all(imagePromises);
            setSnowflakeImages(loadedImages);
        };

        if (isActive) {
            loadImages();
        }
    }, [snowColor, isActive]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden font-sans">

            {/* Layer 0: Background "Dot" Snow - The "real-like" depth */}
            <Snowfall
                color={snowColor}
                snowflakeCount={350} // Increased significantly for more "snowy" feel
                radius={[0.5, 2.5]} // Slightly varied
                speed={[0.5, 3.0]} // Dynamic speed
                wind={wind} // Interactive wind
                style={{
                    position: 'absolute',
                    width: '100vw',
                    height: '100vh',
                }}
            />

            {/* Layer 1: High Performance Snowfall - Foreground Images */}
            <Snowfall
                color={snowColor}
                snowflakeCount={SEASONAL_CONFIG.effects.snowCount}
                radius={[12.0, 28.0]} // Larger radius for detailed vector flakes
                speed={[0.2, 1.0]} // Slower, more natural fall
                wind={wind} // Interactive wind
                images={snowflakeImages.length > 0 ? snowflakeImages : undefined}
                style={{
                    position: 'absolute',
                    width: '100vw',
                    height: '100vh',
                }}
            />

            {/* Layer 2: The "Frost Vignette" - Creates the freezing screen edge effect */}
            <div
                className="absolute inset-0 w-full h-full mix-blend-overlay opacity-60"
                style={{
                    background: theme === 'dark'
                        ? 'radial-gradient(circle, transparent 50%, rgba(56, 189, 248, 0.2) 100%)' // Glowing Cyan edges in dark
                        : 'radial-gradient(circle, transparent 60%, rgba(255, 255, 255, 0.9) 100%)' // Frosted White edges in light
                }}
            />
        </div>
    );
}