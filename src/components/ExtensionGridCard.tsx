import { Download, Info } from 'lucide-react';
import { motion } from 'motion/react';
import type { ExtensionData } from '../data';
import { FlagDisplay } from './FlagDisplay';

interface ExtensionGridCardProps {
  extension: ExtensionData;
  onSelect: (extensionId: string) => void;
}

export function ExtensionGridCard({ extension, onSelect }: ExtensionGridCardProps) {
  const handleSelect = () => onSelect(extension.id);

  // Only use layoutId on desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.div
      layoutId={!isMobile ? `extension-card-${extension.id}` : undefined}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group bg-[var(--bg-surface)] border border-[var(--divider)] rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:border-[var(--brand)] transition-all cursor-pointer"
      style={{ boxShadow: '0 6px 20px 0 rgba(0,0,0,0.08)' }}
      onClick={handleSelect}
    >
      <div className="flex items-start gap-3 mb-3">
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
              className="font-['Inter',sans-serif] text-[var(--text-primary)] truncate"
              style={{ fontWeight: 600, fontSize: '15px' }}
            >
              {extension.name}
            </h3>
          </div>
          <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
            <FlagDisplay region={extension.region} size="small" />
            <span>•</span>
            <span>{extension.types.join(' & ')}</span>
          </div>
        </div>
      </div>

      {extension.supportedApps.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {extension.supportedApps.map((appId) => (
            <span
              key={appId}
              className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs bg-[var(--chip-bg)] text-[var(--text-secondary)] font-['Inter',sans-serif] capitalize"
              style={{ fontWeight: 500 }}
            >
              {appId}
            </span>
          ))}
        </div>
      )}

      {extension.info && (
        <p className="text-sm text-[var(--text-secondary)] font-['Inter',sans-serif] line-clamp-2 mb-4">
          {extension.info}
        </p>
      )}

      <button
        onClick={(event) => {
          event.stopPropagation();
          handleSelect();
        }}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl bg-[var(--chip-bg)] text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white transition-all font-['Inter',sans-serif]"
        style={{ fontWeight: 600, fontSize: '14px' }}
      >
        <Download className="w-4 h-4" />
        View Details
      </button>
    </motion.div>
  );
}
