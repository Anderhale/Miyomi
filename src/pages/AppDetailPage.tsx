import React from 'react';
import { ArrowLeft, Download, Github, MessageSquare, Globe, Calendar, PlayCircle, BookOpen, Tag, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlatformBadge } from '../components/PlatformBadge';
import { TagBadge } from './../components/TagBadge';
import { ParticleBackground } from '../components/ParticleBackground';
import { ExtensionGridCard } from '../components/ExtensionGridCard';
import { getAppById, getAppExtensions } from '../data';
import { useGitHubRelease } from '../hooks/useGitHubRelease';

interface AppDetailPageProps {
  appId: string;
  onNavigate?: (path: string) => void;
}

export function AppDetailPage({ appId, onNavigate }: AppDetailPageProps) {
  const app = getAppById(appId);
  const recommendedExtensions = getAppExtensions(appId);
  const displayedExtensions = recommendedExtensions.slice(0, 3);
  const hasMoreExtensions = recommendedExtensions.length > displayedExtensions.length;
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mobile detection for different animation approach
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Fetch GitHub release data
  const { release, loading: releaseLoading } = useGitHubRelease(
    app?.githubUrl,
    app?.lastUpdated
  );

  const handleBackClick = () => {
    const scrollPos = location.state?.previousScrollPosition;
    
    if (onNavigate) {
      onNavigate('/software');
    } else {
      navigate('/software', { 
        state: { restoreScrollPosition: scrollPos }
      });
    }
    
    // Restore scroll position immediately
    if (scrollPos !== undefined) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollPos, behavior: 'instant' });
        });
      });
    }
  };

  if (!app) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center py-16 sm:py-24">
          <div className="text-6xl sm:text-8xl mb-6 opacity-50">📱</div>
          <h3 className="text-[var(--text-primary)] font-['Poppins',sans-serif] mb-2" style={{ fontSize: '20px', fontWeight: 600 }}>
            App not found
          </h3>
          <p className="text-[var(--text-secondary)] font-['Inter',sans-serif] mb-6">
            The app you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBackClick}
            className="px-6 py-3 bg-[var(--brand)] hover:bg-[var(--brand-strong)] text-white rounded-xl transition-all font-['Inter',sans-serif]"
            style={{ fontWeight: 600 }}
          >
            Back to Software
          </button>
        </div>
      </motion.div>
    );
  }

  const tutorials = app.tutorials ?? [];
  const hasTutorials = tutorials.length > 0;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderActionButtons = (layout: 'inline' | 'stack') => {
    const hasGithub = Boolean(app.githubUrl);
    const hasDiscord = Boolean(app.discordUrl);
    const hasOfficialSite = Boolean(app.officialSite);
    const hasAnyActions = hasGithub || hasDiscord || hasOfficialSite;

    if (!hasAnyActions) {
      return null;
    }

    if (layout === 'inline') {
      return (
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          {hasGithub && (
            <a
              href={app.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[var(--bg-elev-1)] border border-[var(--divider)] rounded-xl hover:bg-[var(--chip-bg)] hover:border-[var(--brand)] transition-all text-[var(--text-secondary)] hover:text-[var(--brand)]"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {hasDiscord && (
            <a
              href={app.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[var(--bg-elev-1)] border border-[var(--divider)] rounded-xl hover:bg-[var(--chip-bg)] hover:border-[var(--brand)] transition-all text-[var(--text-secondary)] hover:text-[var(--brand)]"
              title="Discord"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
          )}
          {hasOfficialSite && (
            <a
              href={app.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[var(--bg-elev-1)] border border-[var(--divider)] rounded-xl hover:bg-[var(--chip-bg)] hover:border-[var(--brand)] transition-all text-[var(--text-secondary)] hover:text-[var(--brand)]"
              title="Website"
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
          {hasGithub && (
            <a
              href={app.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[var(--brand)] hover:bg-[var(--brand-strong)] text-white rounded-xl transition-all font-['Inter',sans-serif]"
              style={{ fontWeight: 600 }}
            >
              <Download className="w-4 h-4" />
              Get App
            </a>
          )}
        </div>
      );
    }

    return (
      <div className="flex w-full flex-col gap-4">
        {hasGithub && (
          <a
            href={app.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3 font-['Inter',sans-serif] text-white transition-all hover:bg-[var(--brand-strong)]"
            style={{ fontWeight: 600 }}
          >
            <Download className="w-4 h-4" />
            Get App
          </a>
        )}
        <div className="flex flex-col gap-2">
          {hasGithub && (
            <a
              href={app.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[var(--divider)] bg-[var(--bg-surface)] px-4 py-3 text-left transition-all hover:border-[var(--brand)] hover:shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--chip-bg)] text-[var(--brand)]">
                <Github className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p
                  className="font-['Inter',sans-serif] text-[var(--text-primary)]"
                  style={{ fontWeight: 600, fontSize: '14px' }}
                >
                  GitHub
                </p>
                <p className="font-['Inter',sans-serif] text-xs text-[var(--text-secondary)]">
                  Project repository
                </p>
              </div>
              <span className="text-lg text-[var(--divider)]">&rarr;</span>
            </a>
          )}
          {hasDiscord && (
            <a
              href={app.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[var(--divider)] bg-[var(--bg-surface)] px-4 py-3 text-left transition-all hover:border-[var(--brand)] hover:shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--chip-bg)] text-[var(--brand)]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p
                  className="font-['Inter',sans-serif] text-[var(--text-primary)]"
                  style={{ fontWeight: 600, fontSize: '14px' }}
                >
                  Discord
                </p>
                <p className="font-['Inter',sans-serif] text-xs text-[var(--text-secondary)]">
                  Join the community
                </p>
              </div>
              <span className="text-lg text-[var(--divider)]">&rarr;</span>
            </a>
          )}
          {hasOfficialSite && (
            <a
              href={app.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[var(--divider)] bg-[var(--bg-surface)] px-4 py-3 text-left transition-all hover:border-[var(--brand)] hover:shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--chip-bg)] text-[var(--brand)]">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p
                  className="font-['Inter',sans-serif] text-[var(--text-primary)]"
                  style={{ fontWeight: 600, fontSize: '14px' }}
                >
                  Website
                </p>
                <p className="font-['Inter',sans-serif] text-xs text-[var(--text-secondary)]">
                  Official site
                </p>
              </div>
              <span className="text-lg text-[var(--divider)]">&rarr;</span>
            </a>
          )}
        </div>
      </div>
    );
  };

  const inlineActions = renderActionButtons('inline');
  const stackedActions = renderActionButtons('stack');
  const showDesktopMeta = Boolean(stackedActions);
  const headerLayoutClasses = showDesktopMeta
    ? 'lg:grid lg:grid-cols-[auto,minmax(0,1fr),minmax(260px,320px)]'
    : 'lg:grid lg:grid-cols-[auto,minmax(0,1fr)]';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto"
    >
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={handleBackClick}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors mb-6 font-['Inter',sans-serif]"
        style={{ fontWeight: 500 }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Software
      </motion.button>

      {/* App Header */}
      <motion.div
        layoutId={!isMobile ? `app-card-${appId}` : undefined}
        initial={isMobile ? { opacity: 0, x: 20 } : false}
        animate={isMobile ? { opacity: 1, x: 0 } : false}
        exit={isMobile ? { opacity: 0, x: -20 } : false}
        transition={isMobile ? { duration: 0.2, ease: "easeOut" } : { 
          type: "spring", 
          stiffness: 260, 
          damping: 35,
          mass: 0.8
        }}
        className="relative bg-[var(--bg-surface)] border border-[var(--divider)] rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 overflow-hidden"
        style={{ boxShadow: '0 6px 20px 0 rgba(0,0,0,0.08)' }}
      >
        <ParticleBackground />
        <div
          className={`relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center lg:gap-8 lg:items-start ${headerLayoutClasses}`}
        >
          {/* App Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl text-white flex-shrink-0 sm:mx-0 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
            {app.logoUrl ? (
              <img src={app.logoUrl} alt={app.name} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center rounded-2xl"
                style={{ backgroundColor: app.iconColor, fontWeight: 700 }}
              >
                <span className="text-4xl lg:text-5xl">{app.name.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* App Info */}
          <div className="w-full min-w-0 flex-1 text-center sm:text-left lg:pr-8">
            <h1
              className="text-[var(--text-primary)] font-['Poppins',sans-serif] mb-2"
              style={{ fontSize: 'clamp(24px, 5vw, 32px)', lineHeight: '1.2', fontWeight: 700 }}
            >
              {app.name}
            </h1>
            <p className="text-[var(--text-secondary)] font-['Inter',sans-serif] mb-4" style={{ fontSize: '16px' }}>
              {app.description}
            </p>

            {/* Tags and Platforms */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start lg:mb-6">
              {app.contentTypes.map((tag, index) => (
                <TagBadge key={index} tag={tag} />
              ))}
              <div className="h-4 w-px bg-[var(--divider)]"></div>
              {app.platforms.map((platform, index) => (
                <PlatformBadge key={index} platform={platform} />
              ))}
            </div>

            {/* Release Info Badges */}
            {release && !releaseLoading && (
              <div className="mb-4">
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {/* Version Badge */}
                  {release.version && release.version !== 'N/A' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--chip-bg)] border border-[var(--divider)] rounded-full">
                      <Tag className="w-3.5 h-3.5 text-[var(--brand)]" />
                      <span className="text-xs sm:text-sm text-[var(--text-primary)] font-['Inter',sans-serif]" style={{ fontWeight: 600 }}>
                        {release.version}
                      </span>
                      {release.isPrerelease && (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-['Inter',sans-serif] bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30" style={{ fontWeight: 600 }}>
                          Pre-release
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Last Updated Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--chip-bg)] border border-[var(--divider)] rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-[var(--brand)]" />
                    <span className="text-xs sm:text-sm text-[var(--text-secondary)] font-['Inter',sans-serif]" style={{ fontWeight: 500 }}>
                      {formatDate(release.date)}
                    </span>
                  </div>
                  
                  {/* Downloads Badge */}
                  {release.downloads > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--chip-bg)] border border-[var(--divider)] rounded-full">
                      <TrendingUp className="w-3.5 h-3.5 text-[var(--brand)]" />
                      <span className="text-xs sm:text-sm text-[var(--text-secondary)] font-['Inter',sans-serif]" style={{ fontWeight: 500 }}>
                        {release.downloads.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Loading State */}
            {releaseLoading && (
              <div className="mb-4">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-24 bg-[var(--chip-bg)] border border-[var(--divider)] rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
            )}

            {/* Download and Links */}
            {inlineActions && <div className="lg:hidden">{inlineActions}</div>}
          </div>

          {/* Desktop Actions */}
          {showDesktopMeta && (
            <div className="hidden lg:flex lg:w-full lg:flex-col lg:items-stretch lg:gap-4">
              {stackedActions}
            </div>
          )}
        </div>
      </motion.div>

      {/* Recommended Extensions Section */}
      {recommendedExtensions.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2
            className="text-[var(--text-primary)] font-['Poppins',sans-serif] mb-4"
            style={{ fontSize: '24px', fontWeight: 600 }}
          >
            Recommended Extensions
          </h2>
          <p className="text-[var(--text-secondary)] font-['Inter',sans-serif] mb-4" style={{ fontSize: '15px' }}>
            Extension sources compatible with {app.name}:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedExtensions.map((ext) => (
              <ExtensionGridCard
                key={ext.id}
                extension={ext}
                onSelect={(extensionId) => onNavigate?.(`/extensions/${extensionId}`)}
              />
            ))}
          </div>
          {hasMoreExtensions && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => onNavigate?.(`/extensions?app=${encodeURIComponent(app.name)}`)}
                className="px-4 py-2 bg-[var(--chip-bg)] hover:bg-[var(--brand)] text-[var(--brand)] hover:text-white rounded-xl transition-all font-['Inter',sans-serif]"
                style={{ fontWeight: 600 }}
              >
                View all extensions
              </button>
            </div>
          )}
        </div>
      )}

      {/* Release Notes */}
      {release && release.notes && release.url && !releaseLoading && (
        <div className="mb-6 sm:mb-8">
          <div className="bg-[var(--bg-surface)] border border-[var(--divider)] rounded-2xl p-6" style={{ boxShadow: '0 6px 20px 0 rgba(0,0,0,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-[var(--text-primary)] font-['Poppins',sans-serif]"
                style={{ fontSize: '20px', fontWeight: 600 }}
              >
                {release.isPrerelease ? 'Pre-Release' : 'Latest Release'}
              </h2>
              <a
                href={release.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--brand)] hover:text-[var(--brand-strong)] transition-colors text-sm font-['Inter',sans-serif]"
                style={{ fontWeight: 500 }}
              >
                <span>View on GitHub</span>
                <Github className="w-4 h-4" />
              </a>
            </div>
            
            <div className="prose prose-sm max-w-none text-[var(--text-secondary)] font-['Inter',sans-serif]">
              <div 
                className="release-notes"
                style={{ 
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {release.notes.split('\n').slice(0, 10).join('\n')}
                {release.notes.split('\n').length > 10 && (
                  <div className="mt-3">
                    <a
                      href={release.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--brand)] hover:text-[var(--brand-strong)] transition-colors text-sm"
                    >
                      Read more →
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Download Assets */}
            {release.assets && release.assets.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--divider)]">
                <p className="text-[var(--text-secondary)] font-['Inter',sans-serif] text-sm mb-3" style={{ fontWeight: 600 }}>
                  Download Assets:
                </p>
                <div className="flex flex-wrap gap-2">
                  {release.assets.slice(0, 3).map((asset, index) => (
                    <a
                      key={index}
                      href={asset.browser_download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--chip-bg)] hover:bg-[var(--brand)] text-[var(--text-secondary)] hover:text-white rounded-lg transition-all text-xs font-['Inter',sans-serif] border border-[var(--divider)]"
                      style={{ fontWeight: 500 }}
                    >
                      <Download className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{asset.name}</span>
                      <span className="text-[10px] opacity-70">
                        ({(asset.size / 1024 / 1024).toFixed(1)}MB)
                      </span>
                    </a>
                  ))}
                  {release.assets.length > 3 && (
                    <a
                      href={release.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 text-[var(--brand)] hover:text-[var(--brand-strong)] transition-colors text-xs font-['Inter',sans-serif]"
                      style={{ fontWeight: 500 }}
                    >
                      +{release.assets.length - 3} more
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {hasTutorials && (
        <div className="mb-6 sm:mb-8">
          <h2
            className="text-[var(--text-primary)] font-['Poppins',sans-serif] mb-4"
            style={{ fontSize: '24px', fontWeight: 600 }}
          >
            Tutorials & Guides
          </h2>
          <p className="text-[var(--text-secondary)] font-['Inter',sans-serif] mb-4" style={{ fontSize: '15px' }}>
            Learn how to get the most out of {app.name} with curated walkthroughs and documentation.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {tutorials.map((tutorial, index) => {
              if (tutorial.type === 'video') {
                return (
                  <div
                    key={`${tutorial.type}-${index}`}
                    className="bg-[var(--bg-surface)] border border-[var(--divider)] rounded-2xl p-4 sm:p-5"
                    style={{ boxShadow: '0 6px 20px 0 rgba(0,0,0,0.08)' }}
                  >
                    <div className="relative w-full mb-3 overflow-hidden rounded-xl aspect-video">
                      <iframe
                        src={tutorial.url}
                        title={tutorial.title}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--chip-bg)] text-[var(--brand)]">
                        <PlayCircle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[var(--text-primary)] font-['Inter',sans-serif]" style={{ fontWeight: 600, fontSize: '15px' }}>
                          {tutorial.title}
                        </h3>
                        {tutorial.description && (
                          <p className="text-[var(--text-secondary)] font-['Inter',sans-serif] text-sm mt-1">
                            {tutorial.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={`${tutorial.type}-${index}`}
                  href={tutorial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-3 rounded-2xl border border-[var(--divider)] bg-[var(--bg-surface)] p-4 sm:p-5 hover:border-[var(--brand)] hover:shadow-lg transition-all"
                  style={{ boxShadow: '0 6px 20px 0 rgba(0,0,0,0.06)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--chip-bg)] text-[var(--brand)]">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[var(--text-primary)] font-['Inter',sans-serif]" style={{ fontWeight: 600, fontSize: '15px' }}>
                        {tutorial.title}
                      </h3>
                      {tutorial.description && (
                        <p className="text-[var(--text-secondary)] font-['Inter',sans-serif] text-sm mt-1">
                          {tutorial.description}
                        </p>
                      )}
                    </div>
                    <span className="ml-auto text-[var(--text-secondary)] group-hover:text-[var(--brand)] transition-colors">
                      &rarr;
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
      {/* Support Section */}
      <div className="bg-[var(--bg-elev-1)] rounded-2xl p-6 text-center">
        <h3 className="text-[var(--text-primary)] font-['Poppins',sans-serif] mb-2" style={{ fontSize: '18px', fontWeight: 600 }}>
          Need Help?
        </h3>
        <p className="text-[var(--text-secondary)] font-['Inter',sans-serif] text-sm mb-4">
          Get support from our community or check our FAQ section.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {app.discordUrl && (
            <a
              href={app.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--divider)] hover:border-[var(--brand)] text-[var(--text-primary)] rounded-xl transition-all font-['Inter',sans-serif] text-sm"
              style={{ fontWeight: 500 }}
            >
              Join Discord
            </a>
          )}
          <button
            onClick={() => onNavigate?.('/faq')}
            className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--divider)] hover:border-[var(--brand)] text-[var(--text-primary)] rounded-xl transition-all font-['Inter',sans-serif] text-sm"
            style={{ fontWeight: 500 }}
          >
            View FAQ
          </button>
        </div>
      </div>
    </motion.div>
  );
}
