import { useMemo } from 'react';
import { SEASONAL_CONFIG, isSeasonalActive } from '../config/seasonal';

export function useSeasonalAsset(assetKey: keyof typeof SEASONAL_CONFIG.assets, defaultAsset: string) {
    const isActive = isSeasonalActive();

    return useMemo(() => {
        if (isActive && SEASONAL_CONFIG.assets[assetKey]) {
            return SEASONAL_CONFIG.assets[assetKey];
        }
        return defaultAsset;
    }, [isActive, assetKey, defaultAsset]);
}