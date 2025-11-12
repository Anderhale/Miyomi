import React from 'react';
import { Download, Github, Globe, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import type { ExtensionData } from '../data';
import { FlagDisplay } from './FlagDisplay';

interface ExtensionListCardProps {
  extension: ExtensionData;
  onSelect: (extensionId: string) => void;
}

export function ExtensionListCard({ extension, onSelect }: ExtensionListCardProps) {
  const handleSelect = () => onSelect(extension.id);

  // Only use layoutId on desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.div
      layoutId={!isMobile ? `extension-card-${extension.id}` : undefined}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className="group bg-[var(--bg-surface)] border border-[var(--divider)] border-l-4 rounded-2xl p-3 sm:p-5 transition-all hover:shadow-lg hover:border-[var(--brand)] cursor-pointer"
      style={{ boxShadow: '0 4px 16px 0 rgba(0,0,0,0.06)', borderLeftColor: extension.accentColor }}
      onClick={handleSelect}
    >
      {/* Desktop layout */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-[var(--chip-bg)]">
            {extension.logoUrl && extension.logoUrl.trim() !== '' ? (
              <img
                src={extension.logoUrl}
                alt={`${extension.name} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  (e.currentTarget.parentElement!.innerHTML = `<div class='flex items-center justify-center w-full h-full text-white' style='background-color:${extension.accentColor};font-weight:600;font-size:20px;'>${extension.name.charAt(0)}</div>`);
                }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white"
                style={{ backgroundColor: extension.accentColor, fontWeight: 600, fontSize: '20px' }}
              >
                {extension.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="font-['Inter',sans-serif] text-[var(--text-primary)]"
                style={{ fontWeight: 600, fontSize: '16px' }}
              >
                {extension.name}
              </h3>
              {extension.github && (
                <a
                  href={extension.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
                  aria-label={`${extension.name} GitHub`}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {extension.website && (
                <a
                  href={extension.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
                  aria-label={`${extension.name} website`}
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <FlagDisplay region={extension.region} size="small" />
              <span>•</span>
              <span
                className="font-['Inter',sans-serif] uppercase tracking-wide text-[11px]"
                style={{ fontWeight: 600 }}
              >
                {extension.types.join(' & ')}
              </span>
            </div>
            {extension.supportedApps.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {extension.supportedApps.map((appId) => (
                  <span
                    key={appId}
                    className="px-2 py-0.5 rounded-md text-[10px] bg-[var(--chip-bg)] text-[var(--text-secondary)] font-['Inter',sans-serif] capitalize"
                    style={{ fontWeight: 500 }}
                  >
                    {appId}
                  </span>
                ))}
              </div>
            )}
            {extension.info && (
              <p className="mt-3 text-sm text-[var(--text-secondary)] font-['Inter',sans-serif] line-clamp-2">
                {extension.info}
              </p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 w-48">
          <button
            onClick={(event) => {
              event.stopPropagation();
              handleSelect();
            }}
            className="w-full px-4 py-2 flex items-center justify-center gap-2 rounded-xl bg-[var(--chip-bg)] text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white transition-all font-['Inter',sans-serif]"
            style={{ fontWeight: 600, fontSize: '14px' }}
          >
            <Download className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex lg:hidden items-start gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-[var(--chip-bg)]">
          {extension.logoUrl && extension.logoUrl.trim() !== '' ? (
            <img
              src={extension.logoUrl}
              alt={`${extension.name} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                (e.currentTarget.parentElement!.innerHTML = `<div class='flex items-center justify-center w-full h-full text-white' style='background-color:${extension.accentColor};font-weight:600;font-size:20px;'>${extension.name.charAt(0)}</div>`);
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white"
              style={{ backgroundColor: extension.accentColor, fontWeight: 600, fontSize: '20px' }}
            >
              {extension.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className="font-['Inter',sans-serif] text-[var(--text-primary)] truncate"
              style={{ fontWeight: 600, fontSize: '14px' }}
            >
              {extension.name}
            </h3>
            {extension.github && (
              <a
                href={extension.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
                aria-label={`${extension.name} GitHub`}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {extension.website && (
              <a
                href={extension.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
                aria-label={`${extension.name} website`}
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-[var(--text-secondary)]">
            <FlagDisplay region={extension.region} size="small" />
            <span>•</span>
            <span>{extension.types.join(' & ')}</span>
            {extension.supportedApps.length > 0 && (
              <>
                <span>•</span>
                <span className="truncate capitalize">{extension.supportedApps.join(', ')}</span>
              </>
            )}
          </div>
        </div>

        {/* View Button - Right Side */}
        <button
          onClick={(event) => {
            event.stopPropagation();
            handleSelect();
          }}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--chip-bg)] group-hover:bg-[var(--brand)] flex items-center justify-center transition-all"
          aria-label="View extension details"
        >
          <ExternalLink className="w-4 h-4 text-[var(--text-primary)] group-hover:text-white transition-colors" />
        </button>
      </div>
    </motion.div>
  );
}
