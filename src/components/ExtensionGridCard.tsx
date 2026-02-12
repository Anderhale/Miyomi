import { Download, Info, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import type { ExtensionData } from '../data';
import { StarRating } from './StarRating';
import { useAccentColor } from '../hooks/useAccentColor';
import { useState } from 'react';
import { LoveButton } from './LoveButton';

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
  const [imageError, setImageError] = useState(false);

  // Only use layoutId on desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const renderLogo = () => {
    const showFallback = imageError || !extension.logoUrl?.trim();

    if (showFallback) {
      return (
        <div
          className="w-full h-full flex items-center justify-center text-white"
          style={{ backgroundColor: accentColor, fontWeight: 600, fontSize: '20px' }}
        >
          {extension.name.charAt(0)}
        </div>
      );
    }

    return (
      <img
        src={extension.logoUrl}
        alt={`${extension.name} logo`}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <motion.div
      layoutId={!isMobile ? `extension-card-${extension.id}` : undefined}
      whileHover={{ y: -4, boxShadow: '0 12px 30px 0 rgba(0,0,0,0.25)', borderColor: 'var(--brand)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group bg-[var(--bg-surface)] border border-[var(--divider)] rounded-2xl p-4 sm:p-5 transition-all cursor-pointer flex flex-col h-[200px]"
      onClick={handleSelect}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-[var(--chip-bg)] group-hover:scale-105 transition-transform">
          {renderLogo()}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-['Inter',sans-serif] text-[var(--text-primary)] mb-1 line-clamp-1"
            style={{ fontWeight: 600, fontSize: '15px', lineHeight: '1.2' }}
          >
            {extension.name}
          </h3>
          <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
            <span className="truncate">{extension.types.join(' + ')}</span>
          </div>
        </div>
      </div>

      {extension.info && (
        <p className="text-sm text-[var(--text-secondary)] font-['Inter',sans-serif] line-clamp-2 mb-4 h-[34px] overflow-hidden" style={{ fontSize: '12px', lineHeight: '1.4' }}>
          {extension.info}
        </p>
      )}

      {/* Footer: Love Button and View Details */}
      <div className="mt-auto pt-3 border-t border-[var(--divider)] w-full flex items-center justify-between">
        <LoveButton itemId={extension.id} preloadedState={voteData} allowFetch={allowFetch} />

        <button
          onClick={(event) => {
            event.stopPropagation();
            handleSelect();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
        >
          <span>View Details</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
