import React, { useEffect, useState } from 'react';
import Snowfall from 'react-snowfall';
import { SEASONAL_CONFIG, isSeasonalActive } from '../config/seasonal';
import { useTheme } from './ThemeProvider';
import { SNOWFLAKE_DATA } from './snowflakePaths';

export function ChristmasSnow() {
    const { theme } = useTheme();
    const isActive = isSeasonalActive();
    const [snowflakeImages, setSnowflakeImages] = useState<HTMLImageElement[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    const snowColor = theme === 'dark' ? '#ffffff' : '#0ea5e9';
    // Mobile check for performance optimization
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);

        checkMobile();

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isActive) return;

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

        loadImages();
    }, [isActive, snowColor]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden font-sans">
            {/* Standard Snow - Reduced count on mobile */}
            <Snowfall
                color={snowColor}
                snowflakeCount={isMobile ? 50 : 350}
                radius={[0.5, 2.5]}
                speed={[0.5, 3.0]}
                wind={SEASONAL_CONFIG.effects.wind}
                style={{
                    position: 'absolute',
                    width: '100vw',
                    height: '100vh',
                }}
            />

            <Snowfall
                color={snowColor}
                snowflakeCount={isMobile ? 10 : SEASONAL_CONFIG.effects.snowCount}
                radius={[12.0, 28.0]}
                speed={[0.2, 1.0]}
                wind={SEASONAL_CONFIG.effects.wind}
                images={snowflakeImages.length > 0 ? snowflakeImages : undefined}
                style={{
                    position: 'absolute',
                    width: '100vw',
                    height: '100vh',
                }}
            />

            {!isMobile && (
                <div
                    className="absolute inset-0 w-full h-full mix-blend-overlay opacity-60 pointer-events-none"
                    style={{
                        background: theme === 'dark'
                            ? 'radial-gradient(circle, transparent 50%, rgba(56, 189, 248, 0.2) 100%)' // Glowing Cyan edges in dark
                            : 'radial-gradient(circle, transparent 60%, rgba(255, 255, 255, 0.9) 100%)' // Frosted White edges in light
                    }}
                />
            )}
        </div>
    );
}