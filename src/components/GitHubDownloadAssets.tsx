import React from 'react';
import { Download } from 'lucide-react';
import type { ReleaseData } from '../hooks/useGitHubRelease';

type ReleaseAsset = ReleaseData['assets'][number];

interface GitHubDownloadAssetsProps {
  assets?: ReleaseAsset[];
  releaseUrl?: string;
  maxVisible?: number;
  className?: string;
}

export function GitHubDownloadAssets({
  assets = [],
  releaseUrl,
  maxVisible = 3,
  className = 'mt-4 pt-4 border-t border-[var(--divider)]',
}: GitHubDownloadAssetsProps) {
  if (!assets.length) {
    return null;
  }

  const visibleAssets = assets.slice(0, maxVisible);
  const remaining = assets.length - visibleAssets.length;

  return (
    <div className={className}>
      <p
        className="mb-3 text-sm text-[var(--text-secondary)] font-['Inter',sans-serif]"
        style={{ fontWeight: 600 }}
      >
        Download Assets:
      </p>
      <div className="flex flex-wrap gap-2">
        {visibleAssets.map((asset, index) => (
          <a
            key={`${asset.name}-${index}`}
            href={asset.browser_download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--divider)] bg-[var(--chip-bg)] px-3 py-2 text-xs text-[var(--text-secondary)] transition-all hover:bg-[var(--brand)] hover:text-white font-['Inter',sans-serif]"
            style={{ fontWeight: 500 }}
          >
            <Download className="w-3 h-3" />
            <span className="max-w-[150px] truncate">{asset.name}</span>
            <span className="text-[10px] opacity-70">
              ({(asset.size / 1024 / 1024).toFixed(1)}MB)
            </span>
          </a>
        ))}

        {remaining > 0 && releaseUrl && (
          <a
            href={releaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-2 text-xs text-[var(--brand)] transition-colors hover:text-[var(--brand-strong)] font-['Inter',sans-serif]"
            style={{ fontWeight: 500 }}
          >
            +{remaining} more
          </a>
        )}
      </div>
    </div>
  );
}

