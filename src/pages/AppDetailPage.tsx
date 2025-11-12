import React from 'react';
import { ArrowLeft, Download, Github, MessageSquare, Globe, PlayCircle, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlatformBadge } from '../components/PlatformBadge';
import { TagBadge } from './../components/TagBadge';
import { ParticleBackground } from '../components/ParticleBackground';
import { ExtensionGridCard } from '../components/ExtensionGridCard';
import { GitHubReleaseMeta, GitHubReleaseNotes } from '../components/GitHubReleaseMeta';
import { GitHubDownloadAssets } from '../components/GitHubDownloadAssets';
import { GitHubCommitSummary } from '../components/GitHubCommitSummary';
import { getAppById, getAppExtensions, getExtensionById } from '../data';
import { useGitHubRelease } from '../hooks/useGitHubRelease';
import { useGitHubLastCommit } from '../hooks/useGitHubLastCommit';

type StatusStyle = {
  bg: string;
  text: string;
  border: string;
};

const STATUS_STYLE_MAP: Record<string, StatusStyle> = {
  active: { bg: 'rgba(76, 175, 80, 0.12)', text: '#4CAF50', border: 'rgba(76, 175, 80, 0.35)' },
  discontinued: { bg: 'rgba(255, 99, 71, 0.15)', text: '#FF6347', border: 'rgba(255, 99, 71, 0.4)' },
  abandoned: { bg: 'rgba(255, 193, 7, 0.15)', text: '#FFB300', border: 'rgba(255, 193, 7, 0.4)' },
  suspended: { bg: 'rgba(156, 39, 176, 0.15)', text: '#9C27B0', border: 'rgba(156, 39, 176, 0.35)' },
  dmca: { bg: 'rgba(233, 30, 99, 0.15)', text: '#E91E63', border: 'rgba(233, 30, 99, 0.35)' },
  dead: { bg: 'rgba(158, 158, 158, 0.15)', text: '#9E9E9E', border: 'rgba(158, 158, 158, 0.35)' },
};

const ActiveRippleDot: React.FC = () => {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <span
      className="relative inline-flex items-center justify-center"
      role="status"
      aria-label="Active"
      title="Active"
      style={{ width: 20, height: 20 }}
    >
      {/* Solid core dot */}
      <span
        className="absolute rounded-full"
        style={{
          width: 16,
          height: 16,
          backgroundColor: '#4CAF50',
          boxShadow: '0 0 12px rgba(76,175,80,0.6)',
          zIndex: 3,
        }}
      />

      {/* Multiple wave rings */}
      {!reduce && (
        <>
          {[0, 0.6, 1.2].map((delay, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                width: 16,
                height: 16,
                border: '2px solid #4CAF50',
                boxSizing: 'border-box',
              }}
              animate={{
                scale: [1, 4],
                opacity: [0.7, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay,
              }}
            />
          ))}
        </>
      )}

      {/* Accessible hidden text */}
      <span
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Active
      </span>
    </span>
  );
};

const STATUS_LABEL_MAP: Record<string, string> = {
  active: 'Active',
  discontinued: 'Discontinued',
  abandoned: 'Abandoned',
  suspended: 'Suspended',
  dmca: 'DMCA',
  dead: 'Dead',
};

const DEFAULT_STATUS_STYLE: StatusStyle = {
  bg: 'rgba(255, 255, 255, 0.08)',
  text: 'var(--text-secondary)',
  border: 'rgba(255, 255, 255, 0.2)',
};

const getStatusLabel = (status: string): string => {
  const normalized = status.trim().toLowerCase();
  if (STATUS_LABEL_MAP[normalized]) {
    return STATUS_LABEL_MAP[normalized];
  }

  return status
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

interface AppDetailPageProps {
  appId: string;
  onNavigate?: (path: string) => void;
}

export function AppDetailPage({ appId, onNavigate }: AppDetailPageProps) {
  const app = getAppById(appId);
  const supportedExtensions = (app?.supportedExtensions ?? [])
    .map((extensionId) => getExtensionById(extensionId))
    .filter((ext): ext is NonNullable<typeof ext> => Boolean(ext));
  const recommendedExtensions =
    supportedExtensions.length > 0 ? supportedExtensions : getAppExtensions(appId);
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
  const { commit, commits, loading: commitLoading } = useGitHubLastCommit(
    app?.githubUrl,
    app?.lastUpdated
  );

  const getGithubOwner = (githubUrl?: string) => {
    if (!githubUrl) return null;
    try {
      if (!githubUrl.startsWith('http')) {
        const [owner] = githubUrl.split('/');
        return owner || null;
      }
      const url = new URL(githubUrl);
      const [owner] = url.pathname.split('/').filter(Boolean);
      return owner || null;
    } catch (error) {
      console.warn('Failed to parse GitHub URL for owner:', error);
      return null;
    }
  };

  const authorInfo = React.useMemo(() => {
    if (!app) return null;
    const githubOwner = getGithubOwner(app.githubUrl);
    if (app.author) {
      return {
        name: app.author,
        url: githubOwner ? `https://github.com/${githubOwner}` : app.officialSite || null,
      };
    }
    if (githubOwner) {
      return {
        name: githubOwner,
        url: `https://github.com/${githubOwner}`,
      };
    }
    return null;
  }, [app]);

  const statusBadge = React.useMemo<React.ReactNode>(() => {
    const s = app?.status?.trim().toLowerCase();
    if (!s) return null;

    if (s === 'active') {
      return <ActiveRippleDot />; // ✅ dot only
    }

    const style = STATUS_STYLE_MAP[s] ?? DEFAULT_STATUS_STYLE;
    return (
      <span
        className="inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-wide"
        style={{
          fontWeight: 600,
          letterSpacing: '0.08em',
          backgroundColor: style.bg,
          color: style.text,
          borderColor: style.border,
        }}
      >
        {getStatusLabel(app.status)}
      </span>
    );
  }, [app?.status]);

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
            <div className="mb-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h1
                className="text-[var(--text-primary)] font-['Poppins',sans-serif]"
                style={{ fontSize: 'clamp(24px, 5vw, 32px)', lineHeight: '1.2', fontWeight: 700 }}
              >
                {app.name}
              </h1>
              {statusBadge}
            </div>
            {authorInfo && (
              <p
                className="text-[var(--text-secondary)] font-['Inter',sans-serif] mb-1"
                style={{ fontSize: '14px' }}
              >
                by{' '}
                {authorInfo.url ? (
                  <a
                    href={authorInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-primary)] hover:text-[var(--brand)] transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    {authorInfo.name}
                  </a>
                ) : (
                  <span style={{ fontWeight: 600 }}>{authorInfo.name}</span>
                )}
              </p>
            )}
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

            <GitHubReleaseMeta
              release={release}
              loading={releaseLoading}
              formatDate={formatDate}
            />

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

            <GitHubReleaseNotes
              notes={release.notes}
              releaseUrl={release.url}
              maxLines={10}
            />

            <GitHubDownloadAssets assets={release.assets} releaseUrl={release.url} />
          </div>
        </div>
      )}

      {app.githubUrl && (
        <GitHubCommitSummary
          commit={commit}
          commits={commits}
          loading={commitLoading}
          formatDate={formatDate}
        />
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
