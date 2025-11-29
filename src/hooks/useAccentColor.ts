import { useEffect, useState } from 'react';
import ColorThief from 'color-thief-browser';

interface UseAccentColorOptions {
  logoUrl?: string;
  preferredColor?: string;
  defaultColor?: string;
}

/**
 * Derives an accent color from the logo using ColorThief when a preferredColor is not provided.
 * Falls back to defaultColor when extraction fails.
 */
export function useAccentColor({
  logoUrl,
  preferredColor,
  defaultColor = 'var(--brand)',
}: UseAccentColorOptions): string {
  const [accentColor, setAccentColor] = useState<string>(preferredColor || defaultColor);
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (preferredColor) {
      setAccentColor(preferredColor);
      return;
    }

    if (!logoUrl || !isBrowser) {
      setAccentColor(defaultColor);
      return;
    }

    let isCancelled = false;
    const image = new Image();
    image.crossOrigin = 'anonymous';

    const handleLoad = () => {
      try {
        // color-thief's quantize implementation expects a global "index" in strict mode
        // because it assigns to it without declaring. Ensure it's present to avoid ReferenceError.
        (globalThis as Record<string, any>).index ??= 0;

        if (!image.naturalWidth || !image.naturalHeight) {
          throw new Error('Image dimensions are zero');
        }

        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(image, 10) as [number, number, number][] | null;

        const toHsv = ([r, g, b]: [number, number, number]) => {
          const rn = r / 255;
          const gn = g / 255;
          const bn = b / 255;
          const max = Math.max(rn, gn, bn);
          const min = Math.min(rn, gn, bn);
          const delta = max - min;
          const saturation = max === 0 ? 0 : delta / max;
          return { saturation, value: max };
        };

        const pickAccent = (colors: [number, number, number][]) => {
          let best: [number, number, number] | null = null;
          let bestScore = -Infinity;

          colors.forEach((color) => {
            const { saturation, value } = toHsv(color);

            // Filter out likely backgrounds: too dark, too bright, or nearly gray
            if (value < 0.2 || value > 0.9) return;
            if (saturation < 0.25) return;

            // Favor saturated mid-bright colors
            const score = saturation * 0.7 + (1 - Math.abs(0.6 - value)) * 0.3;
            if (score > bestScore) {
              bestScore = score;
              best = color;
            }
          });

          return best ?? colors[0];
        };

        const chosen = palette && palette.length > 0 ? pickAccent(palette) : null;
        const [r, g, b] = chosen ?? colorThief.getColor(image);

        if (!isCancelled) {
          setAccentColor(`rgb(${r}, ${g}, ${b})`);
        }
      } catch (error) {
        if (!isCancelled) {
          setAccentColor(defaultColor);
        }
      }
    };

    const handleError = () => {
      if (!isCancelled) {
        setAccentColor(defaultColor);
      }
    };

    image.addEventListener('load', handleLoad);
    image.addEventListener('error', handleError);
    image.src = logoUrl;

    return () => {
      isCancelled = true;
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
    };
  }, [logoUrl, preferredColor, defaultColor]);

  return accentColor;
}
