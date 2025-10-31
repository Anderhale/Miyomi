import { useState, useEffect } from 'react';

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
  prerelease: boolean;
  draft: boolean;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
    download_count: number;
  }>;
}

interface ReleaseData {
  version: string;
  date: string;
  name: string;
  url: string;
  notes: string;
  downloads: number;
  assets: GitHubRelease['assets'];
  isPrerelease: boolean;
}

interface UseGitHubReleaseReturn {
  release: ReleaseData | null;
  loading: boolean;
  error: string | null;
}

const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes
const releaseCache: Map<string, { data: ReleaseData; timestamp: number }> = new Map();

/**
 * Extracts owner/repo from a GitHub URL
 * @param url - GitHub URL (e.g., "https://github.com/owner/repo")
 * @returns "owner/repo" string or null if invalid
 */
function extractRepoFromUrl(url: string): string | null {
  try {
    // If it's already in "owner/repo" format (no protocol)
    if (!url.startsWith('http')) {
      const parts = url.split('/');
      if (parts.length === 2 && parts[0] && parts[1]) {
        return url;
      }
      return null;
    }

    // Extract from full URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 2) {
      return `${pathParts[0]}/${pathParts[1]}`;
    }

    return null;
  } catch (error) {
    console.error('Failed to parse GitHub URL:', error);
    return null;
  }
}

export function useGitHubRelease(githubUrl?: string, fallbackDate?: string): UseGitHubReleaseReturn {
  const [release, setRelease] = useState<ReleaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const githubRepo = githubUrl ? extractRepoFromUrl(githubUrl) : null;
    
    if (!githubRepo) {
      // No valid GitHub URL - use fallback
      if (fallbackDate) {
        setRelease({
          version: 'N/A',
          date: fallbackDate,
          name: 'Latest Version',
          url: '',
          notes: '',
          downloads: 0,
          assets: [],
          isPrerelease: false,
        });
      }
      setLoading(false);
      return;
    }

    const fetchRelease = async () => {
      try {
        const cached = releaseCache.get(githubRepo);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setRelease(cached.data);
          setLoading(false);
          return;
        }

        // Helper function to process release data
        const processReleaseData = (data: GitHubRelease): ReleaseData => {
          const totalDownloads = data.assets.reduce(
            (sum, asset) => sum + asset.download_count,
            0
          );

          return {
            version: data.tag_name,
            date: data.published_at,
            name: data.name || data.tag_name,
            url: data.html_url,
            notes: data.body || '',
            downloads: totalDownloads,
            assets: data.assets,
            isPrerelease: data.prerelease,
          };
        };

        // First, try to fetch the latest release
        let response = await fetch(
          `https://api.github.com/repos/${githubRepo}/releases/latest`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        let releaseData: ReleaseData;

        if (response.ok) {
          const data: GitHubRelease = await response.json();
          releaseData = processReleaseData(data);
        } else if (response.status === 404) {
          // No latest release found (only pre-releases), fetch all releases instead
          response = await fetch(
            `https://api.github.com/repos/${githubRepo}/releases`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
          }

          const releases: GitHubRelease[] = await response.json();

          if (releases.length === 0) {
            throw new Error('No releases found');
          }

          // Get the first release (most recent, includes pre-releases)
          // Filter out drafts since they shouldn't be shown
          const nonDraftReleases = releases.filter(release => !release.draft);
          
          if (nonDraftReleases.length === 0) {
            throw new Error('No published releases found');
          }

          releaseData = processReleaseData(nonDraftReleases[0]);
        } else {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        // Cache the result
        releaseCache.set(githubRepo, {
          data: releaseData,
          timestamp: Date.now(),
        });

        setRelease(releaseData);
        setError(null);
      } catch (err) {
        console.error('Error fetching GitHub release:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch release data');
        
        if (fallbackDate) {
          setRelease({
            version: 'N/A',
            date: fallbackDate,
            name: 'Latest Version',
            url: '',
            notes: '',
            downloads: 0,
            assets: [],
            isPrerelease: false,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRelease();
  }, [githubUrl, fallbackDate]);

  return { release, loading, error };
}

