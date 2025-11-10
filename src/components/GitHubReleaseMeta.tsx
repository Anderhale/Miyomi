import React from 'react';
import { Calendar, Tag, TrendingUp } from 'lucide-react';
import type { ReleaseData } from '../hooks/useGitHubRelease';

interface GitHubReleaseMetaProps {
  release: ReleaseData | null;
  loading?: boolean;
  formatDate: (date?: string) => string;
  className?: string;
}

export function GitHubReleaseMeta({
  release,
  loading = false,
  formatDate,
  className = 'mb-4',
}: GitHubReleaseMetaProps) {
  if (!release && !loading) {
    return null;
  }

  return (
    <div className={className}>
      {release && !loading && (
        <div className="flex flex-wrap items-center justify-center gap-1 sm:justify-start">
          {release.version && release.version !== 'N/A' && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--divider)] bg-[var(--chip-bg)] px-3 py-1.5">
              <Tag className="w-3.5 h-3.5 text-[var(--brand)]" />
              <span
                className="text-xs sm:text-sm text-[var(--text-primary)] font-['Inter',sans-serif]"
                style={{ fontWeight: 600 }}
              >
                {release.version}
              </span>
              {release.isPrerelease && (
                <span
                  className="ml-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-['Inter',sans-serif] text-yellow-600 dark:text-yellow-400"
                  style={{ fontWeight: 600 }}
                >
                  Pre-release
                </span>
              )}
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--divider)] bg-[var(--chip-bg)] px-3 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-[var(--brand)]" />
            <span
              className="text-xs sm:text-sm text-[var(--text-secondary)] font-['Inter',sans-serif]"
              style={{ fontWeight: 500 }}
            >
              {formatDate(release?.date)}
            </span>
          </div>

          {release?.downloads && release.downloads > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--divider)] bg-[var(--chip-bg)] px-3 py-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[var(--brand)]" />
              <span
                className="text-xs sm:text-sm text-[var(--text-secondary)] font-['Inter',sans-serif]"
                style={{ fontWeight: 500 }}
              >
                {release.downloads.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 w-24 rounded-full border border-[var(--divider)] bg-[var(--chip-bg)] animate-pulse"
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

