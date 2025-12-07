import { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  theme?: 'light' | 'dark';
}

type Snowflake = {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  swaySpeed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
};

type BokehParticle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
};

type Sparkle = {
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
  opacity: number;
  twinkle: number;
};

export function ParticleBackground({ theme = 'dark' }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const bokehRef = useRef<BokehParticle[]>([]);
  const sparklesRef = useRef<Sparkle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const gradientOffsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Anime-inspired color palettes
    const bokehPalettes = {
      light: [
        'rgba(147, 197, 253, 0.6)', // Sky blue
        'rgba(196, 181, 253, 0.5)', // Lavender
        'rgba(251, 207, 232, 0.5)', // Pink
        'rgba(167, 243, 208, 0.4)', // Mint
      ],
      dark: [
        'rgba(59, 130, 246, 0.7)',  // Bright blue
        'rgba(139, 92, 246, 0.6)',  // Purple
        'rgba(236, 72, 153, 0.6)',  // Pink
        'rgba(34, 211, 238, 0.5)',  // Cyan
      ],
    };

    const effectiveTheme: 'light' | 'dark' = theme === 'light' || theme === 'dark' ? theme : 'dark';
    const bokehColors = bokehPalettes[effectiveTheme];

    // Particle counts
    const snowflakeCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 60);
    const bokehCount = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 40);

    // Create snowflakes with depth layers
    const createSnowflake = (randomY = false): Snowflake => {
      const depth = Math.random(); // 0 = far, 1 = close
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : -10,
        size: 1 + depth * 3, // Larger = closer
        speed: 0.3 + depth * 1.2,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.03,
        opacity: 0.3 + depth * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
      };
    };

    // Create bokeh particles
    const createBokeh = (randomY = false): BokehParticle => {
      const depth = Math.random();
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : -20,
        size: 10 + depth * 30,
        speed: 0.1 + depth * 0.4,
        opacity: 0.15 + depth * 0.25,
        color: bokehColors[Math.floor(Math.random() * bokehColors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      };
    };

    // Create sparkle
    const createSparkle = (): Sparkle => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1 + Math.random() * 2,
        life: 0,
        maxLife: 60 + Math.random() * 60,
        opacity: 0.7 + Math.random() * 0.3,
        twinkle: Math.random() * Math.PI * 2,
      };
    };

    // Initialize particles
    snowflakesRef.current = Array.from({ length: snowflakeCount }, () => createSnowflake(true));
    bokehRef.current = Array.from({ length: bokehCount }, () => createBokeh(true));
    sparklesRef.current = Array.from({ length: 20 }, createSparkle);

    let lastTimestamp: number | null = null;

    // Draw snowflake
    const drawSnowflake = (s: Snowflake) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.globalAlpha = s.opacity;

      // Simple crystalline shape
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = s.size * 2;
      ctx.shadowColor = '#ffffff';

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * s.size, Math.sin(angle) * s.size);
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = s.size * 0.3;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.restore();
    };

    // Draw bokeh
    const drawBokeh = (b: BokehParticle) => {
      const currentSize = b.size + Math.sin(b.pulse) * (b.size * 0.15);
      const gradient = ctx.createRadialGradient(
        b.x, b.y, 0,
        b.x, b.y, currentSize
      );

      const baseColor = b.color.replace(/[\d.]+\)$/g, '0.8)');
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(0.4, b.color);
      gradient.addColorStop(1, b.color.replace(/[\d.]+\)$/g, '0)'));

      ctx.globalAlpha = b.opacity;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(b.x, b.y, currentSize, 0, Math.PI * 2);
      ctx.fill();
    };

    // Draw sparkle
    const drawSparkle = (sp: Sparkle) => {
      const lifeFactor = sp.life / sp.maxLife;
      const fadeIn = Math.min(lifeFactor * 4, 1);
      const fadeOut = Math.max(1 - (lifeFactor - 0.75) * 4, 0);
      const alpha = fadeIn * fadeOut * sp.opacity * (0.5 + Math.sin(sp.twinkle) * 0.5);

      if (alpha <= 0) return;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = sp.size * 4;
      ctx.shadowColor = '#88ccff';

      // Draw cross sparkle
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
    };

    // Draw animated gradient overlay
    const drawGradientOverlay = () => {
      const gradient = ctx.createLinearGradient(
        0, 0, canvas.width, canvas.height
      );

      if (effectiveTheme === 'dark') {
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.03 + Math.sin(gradientOffsetRef.current) * 0.02})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.02 + Math.cos(gradientOffsetRef.current * 1.3) * 0.015})`);
        gradient.addColorStop(1, `rgba(236, 72, 153, ${0.03 + Math.sin(gradientOffsetRef.current * 0.8) * 0.02})`);
      } else {
        gradient.addColorStop(0, `rgba(147, 197, 253, ${0.04 + Math.sin(gradientOffsetRef.current) * 0.02})`);
        gradient.addColorStop(0.5, `rgba(196, 181, 253, ${0.03 + Math.cos(gradientOffsetRef.current * 1.3) * 0.015})`);
        gradient.addColorStop(1, `rgba(251, 207, 232, ${0.04 + Math.sin(gradientOffsetRef.current * 0.8) * 0.02})`);
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient overlay
      drawGradientOverlay();
      gradientOffsetRef.current += deltaSeconds * 0.5;

      // Update and draw bokeh (back layer)
      bokehRef.current.forEach((b) => {
        b.y += b.speed;
        b.pulse += b.pulseSpeed;

        if (b.y > canvas.height + b.size) {
          Object.assign(b, createBokeh(false));
        }

        drawBokeh(b);
      });

      // Update and draw snowflakes (middle layer)
      snowflakesRef.current.forEach((s) => {
        s.y += s.speed;
        s.sway += s.swaySpeed;
        s.x += Math.sin(s.sway) * 0.5;
        s.rotation += s.rotationSpeed;

        if (s.y > canvas.height + 10) {
          Object.assign(s, createSnowflake(false));
        }

        drawSnowflake(s);
      });

      // Update and draw sparkles (front layer)
      sparklesRef.current.forEach((sp, index) => {
        sp.life++;
        sp.twinkle += 0.1;

        if (sp.life >= sp.maxLife) {
          sparklesRef.current[index] = createSparkle();
        }

        drawSparkle(sp);
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
