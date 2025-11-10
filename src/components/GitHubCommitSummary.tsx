import React from 'react';
import { Calendar, Github } from 'lucide-react';
import type { CommitData } from '../hooks/useGitHubLastCommit';

interface GitHubCommitSummaryProps {
  commit: CommitData | null;
  loading?: boolean;
  formatDate?: (date?: string) => string;
  className?: string;
}

const defaultFormatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export function GitHubCommitSummary({
  commit,
  loading = false,
  formatDate = defaultFormatDate,
  className = 'mb-6 sm:mb-8',
}: GitHubCommitSummaryProps) {
  if (!commit && !loading) {
    return null;
  }

  return (
    <div
      className={`bg-[var(--bg-surface)] border border-[var(--divider)] rounded-2xl p-6 ${className}`}
      style={{ boxShadow: '0 6px 20px 0 rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-['Inter',sans-serif]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--chip-bg)] text-[var(--brand)]">
            <Github className="w-4 h-4" />
          </span>
          <span style={{ fontWeight: 600 }}>Latest GitHub Commit</span>
        </div>
        {commit?.url && (
          <a
            href={commit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--brand)] hover:text-[var(--brand-strong)] transition-colors font-['Inter',sans-serif]"
            style={{ fontWeight: 500 }}
          >
            View commit →
          </a>
        )}
      </div>

      {loading && (
        <div className="space-y-3">
          <div className="h-4 w-2/3 rounded bg-[var(--chip-bg)] animate-pulse"></div>
          <div className="h-3 w-1/2 rounded bg-[var(--chip-bg)] animate-pulse"></div>
        </div>
      )}

      {!loading && commit && (
        <div className="space-y-3">
          <p
            className="text-[var(--text-primary)] font-['Inter',sans-serif]"
            style={{ fontWeight: 600, fontSize: '15px' }}
          >
            {commit.message}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)] font-['Inter',sans-serif]">
            <span>
              <span className="opacity-70">Author:</span> {commit.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--brand)]" />
              {formatDate(commit.date)}
            </span>
            {commit.sha && (
              <span className="rounded-full bg-[var(--chip-bg)] px-2 py-0.5 font-mono text-[var(--text-secondary)] text-[11px]">
                {commit.sha}
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
