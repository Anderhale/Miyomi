import { Download, Info } from 'lucide-react';
import { motion } from 'motion/react';
import type { ExtensionData } from '../data';
import { FlagDisplay } from './FlagDisplay';
import { StarRating } from './StarRating';
import { useAccentColor } from '../hooks/useAccentColor';
import { useState } from 'react';

interface ExtensionGridCardProps {
  extension: ExtensionData;
  onSelect: (extensionId: string) => void;
}

export function ExtensionGridCard({ extension, onSelect }: ExtensionGridCardProps) {
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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group bg-[var(--bg-surface)] border border-[var(--divider)] rounded-2xl p-3 sm:p-5 hover:shadow-lg hover:border-[var(--brand)] transition-all cursor-pointer flex flex-col"
      style={{ boxShadow: '0 6px 20px 0 rgba(0,0,0,0.08)' }}
      onClick={handleSelect}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-[var(--chip-bg)] group-hover:scale-105 transition-transform">
          {renderLogo()}
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3
            className="font-['Inter',sans-serif] text-[var(--text-primary)] mb-1 line-clamp-2"
            style={{ fontWeight: 600, fontSize: '14px', lineHeight: '1.3', wordBreak: 'break-word' }}
          >
            {extension.name}
          </h3>
          <div className="text-xs text-[var(--text-secondary)] flex items-center justify-center sm:justify-start gap-1.5 mb-1">
            <FlagDisplay region={extension.region} size="small" />
          </div>
          <div className="text-xs text-[var(--text-secondary)] flex items-center justify-center sm:justify-start gap-1">
            <span>{extension.types.join(' + ')}</span>
          </div>
        </div>
      </div>


      {extension.info && (
        <p className="text-sm text-[var(--text-secondary)] font-['Inter',sans-serif] line-clamp-2 mb-2 sm:mb-4 text-center sm:text-left flex-grow" style={{ fontSize: '12px', lineHeight: '1.4' }}>
          {extension.info}
        </p>
      )}

      <button
        onClick={(event) => {
          event.stopPropagation();
          handleSelect();
        }}
        className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg sm:rounded-xl bg-[var(--chip-bg)] text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white transition-all font-['Inter',sans-serif] mt-auto"
        style={{ fontWeight: 600, fontSize: '13px' }}
      >
        <Download className="w-4 h-4" />
        View Details
      </button>
    </motion.div>
  );
}
