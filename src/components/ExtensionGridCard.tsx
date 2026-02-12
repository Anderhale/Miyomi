import { Download, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import type { ExtensionData } from '../data';
import { StarRating } from './StarRating';
import { useAccentColor } from '../hooks/useAccentColor';
import { useState } from 'react';
import { LoveButton } from './LoveButton';
import { AppLogo } from './AppLogo';
import { TagBadge } from './TagBadge';

interface ExtensionGridCardProps {
  extension: ExtensionData;
  voteData?: { count: number; loved: boolean };
  allowFetch?: boolean;
  onSelect: (extensionId: string) => void;
}

export function ExtensionGridCard({ extension, voteData, allowFetch = true, onSelect }: ExtensionGridCardProps) {
  const handleSelect = () => onSelect(extension.id);
  const accentColor = useAccentColor({
    logoUrl: extension.logoUrl,
    preferredColor: extension.accentColor,
    defaultColor: 'var(--brand)',
  });

  // Only use layoutId on desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.button
      layoutId={!isMobile ? `extension-card-${extension.id}` : undefined}
      whileHover={{ y: -4, boxShadow: '0 12px 30px 0 rgba(0,0,0,0.25)', borderColor: 'var(--brand)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="p-3 sm:p-6 bg-[var(--bg-surface)] border border-[var(--divider)] rounded-2xl transition-all text-left w-full group flex flex-col h-[210px] sm:h-[220px]"
      onClick={handleSelect}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mb-2 sm:mb-4">
        <div className="flex-shrink-0 group-hover:scale-105 transition-transform">
          <AppLogo
            name={extension.name}
            logoUrl={extension.logoUrl}
            iconColor={accentColor}
            className="w-12 h-12 sm:w-16 sm:h-16"
            roundedClass="rounded-xl sm:rounded-2xl"
            textClassName="text-lg sm:text-2xl"
          />
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left w-full">
          <h3
            className="font-['Inter',sans-serif] text-[var(--text-primary)] mb-1 sm:mb-1 line-clamp-1"
            style={{ fontWeight: 600, fontSize: '14px', lineHeight: '1.3' }}
          >
            {extension.name}
          </h3>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
            {extension.types.map((type, index) => (
              <TagBadge key={index} tag={type as any} mobile={isMobile} />
            ))}
          </div>
        </div>
      </div>

      {extension.info && (
        <p
          className="text-[var(--text-secondary)] font-['Inter',sans-serif] mb-2 sm:mb-4 line-clamp-2 text-center sm:text-left flex-grow"
          style={{ fontSize: '12px', lineHeight: '1.4' }}
        >
          {extension.info}
        </p>
      )}

      {/* Footer: Love Button */}
      <div className="mt-auto pt-3 border-t border-[var(--divider)] w-full flex items-center justify-between">
        <LoveButton itemId={extension.id} preloadedState={voteData} allowFetch={allowFetch} />

        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--brand)] transition-colors">
          <span className="hidden sm:inline">View Details</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </motion.button>
  );
}
