import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { unifiedApps } from '../data';
import type { AppData } from '../data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AppMeta {
    downloads?: number;
    lastUpdated?: string;
}

interface CachedMeta {
    /** ISO timestamp when this cache was saved */
    cachedAt: string;
    /** Keyed by app id */
    data: Record<string, AppMeta>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const META_URL =
    'https://cdn.jsdelivr.net/gh/tas33n/Miyomi@data-updates/app-meta.json';
const STORAGE_KEY = 'miyomi-app-meta';
const TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readCache(): CachedMeta | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as CachedMeta;
    } catch {
        return null;
    }
}

function writeCache(data: Record<string, AppMeta>): void {
    try {
        const payload: CachedMeta = { cachedAt: new Date().toISOString(), data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // localStorage full or unavailable — silently ignore
    }
}

function isFresh(cached: CachedMeta): boolean {
    const age = Date.now() - new Date(cached.cachedAt).getTime();
    return age < TTL_MS;
}

function mergeApps(
    apps: AppData[],
    meta: Record<string, AppMeta>,
): AppData[] {
    return apps.map((app) => {
        const m = meta[app.id];
        if (!m) return app;
        return {
            ...app,
            ...(m.downloads !== undefined && { downloads: m.downloads }),
            ...(m.lastUpdated !== undefined && { lastUpdated: m.lastUpdated }),
        };
    });
}

async function fetchMeta(): Promise<Record<string, AppMeta>> {
    const res = await fetch(META_URL, {
        cache: 'no-cache',
        headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // Strip the _generatedAt key — the rest are app entries
    const { _generatedAt, ...entries } = json;
    return entries as Record<string, AppMeta>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Provides `AppData[]` with dynamic metadata (downloads, lastUpdated)
 * merged from the `data-updates` branch.
 *
 * - **Cache hit**: instant, no toast
 * - **Stale cache**: shows stale data, silently refreshes in background
 * - **Cold start**: shows a loading toast, fetches, then confirms via toast
 */
export function useAppMeta(): { apps: AppData[]; loading: boolean } {
    const [meta, setMeta] = useState<Record<string, AppMeta> | null>(() => {
        // Synchronous initial read from localStorage
        const cached = readCache();
        return cached?.data ?? null;
    });
    const [loading, setLoading] = useState(false);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const cached = readCache();

        // ----- Cache hit (fresh) — nothing to do -----
        if (cached && isFresh(cached)) {
            return;
        }

        // ----- Cold start — no cache at all -----
        const isColdStart = !cached;

        if (isColdStart) {
            setLoading(true);
            const toastId = toast.loading('Fetching latest metadata…', {
                description: 'Grabbing download counts & release info',
            });

            fetchMeta()
                .then((data) => {
                    writeCache(data);
                    setMeta(data);
                    toast.success('Metadata updated ✓', {
                        id: toastId,
                        duration: 2000,
                    });
                })
                .catch(() => {
                    toast.warning('Could not fetch metadata', {
                        id: toastId,
                        description: 'Showing cached data',
                        duration: 3000,
                    });
                })
                .finally(() => setLoading(false));
            return;
        }

        // ----- Stale cache — serve stale, background refresh -----
        fetchMeta()
            .then((data) => {
                writeCache(data);
                setMeta(data);
            })
            .catch(() => {
                // Silently keep stale data
            });
    }, []);

    const apps = meta ? mergeApps(unifiedApps, meta) : unifiedApps;
    return { apps, loading };
}
