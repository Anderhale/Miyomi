import { TagBadge } from './TagBadge';
import { ExternalLink } from 'lucide-react';
import { AppLogo } from './AppLogo';
import { PlatformBadge } from './PlatformBadge';
import { motion } from 'motion/react';

interface AppListCardProps {
  appId: string;
  name: string;
  description: string;
  tags: Array<'Manga' | 'Anime' | 'Light Novel' | 'Multi'>;
  platforms: Array<'Windows' | 'Mac' | 'Android' | 'iOS' | 'Linux' | 'Web'>;
  iconColor: string;
  logoUrl?: string;
  onClick?: () => void;
}

export function AppListCard({
  appId,
  name,
  description,
  tags,
  platforms,
  iconColor,
  logoUrl,
  onClick,
}: AppListCardProps) {
  const displayedTags = tags.slice(0, 2);
  const displayedPlatforms = platforms.slice(0, 3);
  const extraPlatforms = platforms.length - displayedPlatforms.length;
  const showPlatformDivider = displayedTags.length > 0 && platforms.length > 0;
  
  // Only use layoutId on desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.button
      layoutId={!isMobile ? `app-card-${appId}` : undefined}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 p-3 bg-[var(--bg-surface)] border border-[var(--divider)] rounded-xl hover:shadow-lg hover:border-[var(--brand)] transition-all w-full text-left group"
      style={{ boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}
    >
      {/* App Icon - Fixed size, full height */}
      <div className="flex-shrink-0 group-hover:scale-105 transition-transform">
        <AppLogo
          name={name}
          logoUrl={logoUrl}
          iconColor={iconColor}
          className="w-14 h-14"
          roundedClass="rounded-xl"
          textClassName="text-lg"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-['Inter',sans-serif] text-[var(--text-primary)] truncate mb-1" style={{ fontWeight: 600, fontSize: '15px' }}>
          {name}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          {displayedTags.map((tag, index) => (
            <TagBadge key={index} tag={tag} />
          ))}
          {showPlatformDivider && <span className="h-4 w-px bg-[var(--divider)]" aria-hidden="true"></span>}
          {platforms.length > 0 && (
            <>
              {displayedPlatforms.map((platform, index) => (
                <PlatformBadge key={`${platform}-${index}`} platform={platform} small />
              ))}
              {extraPlatforms > 0 && (
                <span className="text-[10px] text-[var(--text-secondary)] font-['Inter',sans-serif]" style={{ fontWeight: 500 }}>
                  +{extraPlatforms}
                </span>
              )}
            </>
          )}
        </div>
        <p className="text-[var(--text-secondary)] font-['Inter',sans-serif] text-xs line-clamp-1">
          {description}
        </p>
      </div>

      {/* Action - Compact */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[var(--chip-bg)] group-hover:bg-[var(--brand)] text-[var(--text-primary)] group-hover:text-white rounded-lg transition-all">
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="text-xs font-['Inter',sans-serif]" style={{ fontWeight: 600 }}>
            View
          </span>
        </div>
        <div className="sm:hidden w-8 h-8 rounded-lg bg-[var(--chip-bg)] group-hover:bg-[var(--brand)] flex items-center justify-center transition-all">
          <ExternalLink className="w-4 h-4 text-[var(--text-primary)] group-hover:text-white transition-colors" />
        </div>
      </div>
    </motion.button>
  );
}
