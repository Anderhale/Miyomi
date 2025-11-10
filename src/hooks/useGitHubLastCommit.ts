import { useState, useEffect } from 'react';

export interface CommitData {
  date: string;
  author: string;
  message: string;
  url: string;
  sha: string;
}

interface UseGitHubLastCommitReturn {
  commit: CommitData | null;
  loading: boolean;
  error: string | null;
}

const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes
const commitCache: Map<string, { data: CommitData; timestamp: number }> = new Map();

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

export function useGitHubLastCommit(githubUrl?: string, fallbackDate?: string): UseGitHubLastCommitReturn {
  const [commit, setCommit] = useState<CommitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract repo from URL
    const githubRepo = githubUrl ? extractRepoFromUrl(githubUrl) : null;
    
    if (!githubRepo) {
      // No valid GitHub URL - use fallback
      if (fallbackDate) {
        setCommit({
          date: fallbackDate,
          author: 'Unknown',
          message: 'Last updated',
          url: '',
          sha: '',
        });
      }
      setLoading(false);
      return;
    }

    const fetchLastCommit = async () => {
      try {
        // Check cache first
        const cached = commitCache.get(githubRepo);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setCommit(cached.data);
          setLoading(false);
          return;
        }

        // Fetch from GitHub API - get commits for default branch
        const response = await fetch(
          `https://api.github.com/repos/${githubRepo}/commits?per_page=1`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Repository not found');
          }
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No commits found');
        }

        const lastCommit = data[0];
        const commitData: CommitData = {
          date: lastCommit.commit.author.date,
          author: lastCommit.commit.author.name,
          message: lastCommit.commit.message.split('\n')[0], 
          url: lastCommit.html_url,
          sha: lastCommit.sha.substring(0, 7), 
        };

        // Cache the result
        commitCache.set(githubRepo, {
          data: commitData,
          timestamp: Date.now(),
        });

        setCommit(commitData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch commit data';
        setError(errorMessage);
        console.error('GitHub commit fetch error:', err);

        // Use fallback date on error
        if (fallbackDate) {
          setCommit({
            date: fallbackDate,
            author: 'Unknown',
            message: 'Last updated',
            url: '',
            sha: '',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLastCommit();
  }, [githubUrl, fallbackDate]);

  return { commit, loading, error };
}
