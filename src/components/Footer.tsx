import React from 'react';
import { Heart } from 'lucide-react';
import { useGitHubLastCommit } from '../hooks/useGitHubLastCommit';

export function Footer() {
  const { commit, loading } = useGitHubLastCommit('tas33n/miyomi');
  
  return (
    <footer className="border-t border-[var(--divider)] mt-16 py-8 px-4 sm:px-8 lg:px-[120px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[var(--text-secondary)] font-['Inter',sans-serif] text-sm">
          {/* Left side - Team info */}
          <div className="flex items-center gap-2">
            <span>The Miyomi Team</span>
            <span className="hidden sm:inline">|</span>
            {commit?.url ? (
              <a 
                href={commit.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-xs bg-[var(--chip-bg)] px-2 py-1 rounded hover:bg-[var(--chip-bg-hover)] transition-colors"
                title={commit.message}
              >
                {loading ? '•••••••' : commit.sha || 'loading'}
              </a>
            ) : (
              <span className="font-mono text-xs bg-[var(--chip-bg)] px-2 py-1 rounded">
                {loading ? '•••••••' : commit?.sha || 'a4aded9'}
              </span>
            )}
          </div>
          
          {/* Right side - Made with love */}
          <div className="flex items-center gap-2">
            <span>made with</span>
            <Heart className="w-4 h-4 text-[var(--brand)] fill-[var(--brand)]" />
            <span>and eepy energy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
