import { useEffect, useRef } from 'react';
import { isSeasonalActive } from '../config/seasonal';

export function ChristmasSnow() {
    if (!isSeasonalActive()) return null;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const snowflakes: { x: number; y: number; r: number; d: number }[] = [];
        const maxFlakes = 100;

        for (let i = 0; i < maxFlakes; i++) {
            snowflakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 3 + 1, // radius
                d: Math.random() * maxFlakes, // density
            });
        }

        let animationFrameId: number;

        function draw() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();

            for (let i = 0; i < maxFlakes; i++) {
                const p = snowflakes[i];
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
            }
            ctx.fill();
            update();
            animationFrameId = requestAnimationFrame(draw);
        }

        function update() {
            for (let i = 0; i < maxFlakes; i++) {
                const p = snowflakes[i];
                p.y += Math.cos(p.d) + 1 + p.r / 2;
                p.x += Math.sin(0); // Wind factor

                if (p.x > width + 5 || p.x < -5 || p.y > height) {
                    if (i % 3 > 0) {
                        snowflakes[i] = { x: Math.random() * width, y: -10, r: p.r, d: p.d };
                    } else {
                        // If the flake is exiting from the right
                        if (Math.sin(0) > 0) {
                            snowflakes[i] = { x: -5, y: Math.random() * height, r: p.r, d: p.d };
                        } else {
                            snowflakes[i] = { x: width + 5, y: Math.random() * height, r: p.r, d: p.d };
                        }
                    }
                }
            }
        }

        draw();

        const handleResize = () => {
            if (canvas) {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{ opacity: 0.6 }}
        />
    );
}