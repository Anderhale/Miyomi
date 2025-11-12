import { Plus, Package, Star, Github, MessageSquare, Facebook, Sparkles, Zap, Shield, Twitter, BookOpen } from 'lucide-react';
import { Button } from '../components/Button';
import avatarImage from 'figma:asset/polic.png';
import React from 'react';
import { unifiedApps, unifiedExtensions, guideCategories } from '../data';
import type { LucideIcon } from 'lucide-react';
import { useFeedbackState } from '../hooks/useFeedbackState';
import { AnimatePresence, motion } from 'motion/react';

interface HomePageProps {
  onNavigate?: (path: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { isFeedbackOpen, handleToggle, handleClose } = useFeedbackState();
  const features = [
    {
      icon: <Plus className="w-10 h-10" />,
      title: 'Quickstart',
      description: 'Get started quickly with our comprehensive guides',
      path: '/guides',
      gradient: 'from-[#FFB3C1] to-[#FF6B9D]',
    },
    {
      icon: <Package className="w-10 h-10" />,
      title: 'Software',
      description: 'Software for every Operating System',
      path: '/software',
      gradient: 'from-[#B3D9FF] to-[#4A90E2]',
    },
    {
      icon: <Star className="w-10 h-10" />,
      title: 'Extensions',
      description: 'Cloudstream, Aniyomi & Dantotsu Extension Repos & Guides',
      path: '/extensions',
      gradient: 'from-[#E8D4FF] to-[#7C4DFF]',
    },
  ];

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, label: 'Twitter', link: 'https://x.com/iitachiyomi', color: '#333' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Discord', link: 'https://discord.com/invite/kpfgBACTcs', color: '#5865F2' },
    { icon: <Facebook className="w-5 h-5" />, label: 'Facebook', link: 'https://facebook.com/iitachiyomi', color: '#1877F2' },
  ];
  const formatCount = (value: number) => {
    if (value >= 1000) {
      const formatted = value % 1000 === 0 ? (value / 1000).toString() : (value / 1000).toFixed(1).replace(/\.0$/, '');
      return `${formatted}k+`;
    }
    if (value >= 100) {
      return `${value}+`;
    }
    return `${value}+`;
  };
  const totalGuides = guideCategories.reduce((total, category) => total + category.guides.length, 0);
  type StatKey = 'apps' | 'extensions' | 'guides';
  const statCounts: Record<StatKey, number> = {
    apps: unifiedApps.length,
    extensions: unifiedExtensions.length,
    guides: totalGuides,
  };
  const statMeta: Array<{
    key: StatKey;
    label: string;
    path: string;
    icon: LucideIcon;
    gradient: string;
    glow: string;
    glowAlt: string;
  }> = [
      {
        key: 'apps',
        label: 'Apps',
        path: '/software',
        icon: Package,
        gradient: 'from-[#FFB3C1] to-[#FF6B9D]',
        glow: 'bg-[#FFB3C1]/35',
        glowAlt: 'bg-[#FF6B9D]/25',
      },
      {
        key: 'extensions',
        label: 'Extensions',
        path: '/extensions',
        icon: Zap,
        gradient: 'from-[#B3D9FF] to-[#4A90E2]',
        glow: 'bg-[#B3D9FF]/35',
        glowAlt: 'bg-[#4A90E2]/25',
      },
      {
        key: 'guides',
        label: 'Guides',
        path: '/guides',
        icon: BookOpen,
        gradient: 'from-[#E8D4FF] to-[#7C4DFF]',
        glow: 'bg-[#E8D4FF]/35',
        glowAlt: 'bg-[#7C4DFF]/25',
      }
    ];
  const stats = statMeta.map((meta) => ({
    ...meta,
    count: formatCount(statCounts[meta.key]),
  }));

  const socialGridRef = React.useRef<HTMLDivElement>(null);
  const [useTwoColumns, setUseTwoColumns] = React.useState(false);

  React.useEffect(() => {
    const evaluateColumns = () => {
      const container = socialGridRef.current;
      if (!container) {
        return;
      }

      const previousTemplate = container.style.gridTemplateColumns;
      container.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';

      const hasOverflow = Array.from(container.children).some((child) => {
        if (!(child instanceof HTMLElement)) {
          return false;
        }
        return child.scrollWidth > child.clientWidth + 1;
      });

      container.style.gridTemplateColumns = previousTemplate;

      setUseTwoColumns((prev) => (prev !== hasOverflow ? hasOverflow : prev));
    };

    evaluateColumns();
    window.addEventListener('resize', evaluateColumns);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => evaluateColumns());
      if (socialGridRef.current) {
        resizeObserver.observe(socialGridRef.current);
      }
    }

    return () => {
      window.removeEventListener('resize', evaluateColumns);
      resizeObserver?.disconnect();
    };
  }, [socialLinks.length]);

  return (
    <div className="max-w-7xl mx-auto pt-10">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 -z-10">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#FFB3C1] to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-72 h-72 bg-gradient-to-br from-[#B3D9FF] to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#E8D4FF] to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pb-8 lg:pb-12 relative">
        {/* Mobile Avatar (Above content on mobile) */}
        <div className="lg:hidden flex items-center justify-center mb-4">
          <div className="relative w-48 h-48">
            <div className="animate-float">
              <div className="relative">
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFB3C1] via-[#B3D9FF] to-[#E8D4FF] rounded-full blur-2xl opacity-60 scale-110"></div>

                {/* Avatar */}
                <img
                  src={avatarImage}
                  alt="Miyomi Mascot"
                  height={180}
                  width={180}
                  className="relative z-10 object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Left Content */}
        <div className="relative z-10 text-center lg:text-left">
          {/* H1 Title with Feedback Trigger */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <h1
              className="text-[var(--brand)] font-['Poppins',sans-serif] relative inline-block"
              style={{ fontSize: 'clamp(32px, 8vw, 56px)', lineHeight: '1.1', fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              Miyomi
              <div className="absolute -top-4 -right-8 w-16 h-16 bg-gradient-to-br from-[#FFB3C1] to-[#FF6B9D] rounded-2xl rotate-12 blur-xl opacity-50"></div>
            </h1>
          </div>
          {/* End H1 Title with Feedback Trigger */}

          <p
            className="text-[var(--text-primary)] font-['Inter',sans-serif] mb-8 leading-relaxed"
            style={{ fontSize: 'clamp(16px, 2vw, 18px)', lineHeight: '1.6' }}
          >
            Your one-stop hub for <span className="text-[var(--brand)]" style={{ fontWeight: 600 }}>links, apps, extension repos</span> and more!
          </p>

          {/* CTA Button */}
          <div className="flex justify-center lg:justify-start mb-4">
            <Button variant="primary" onClick={() => onNavigate?.('/software')}>
              <span className="flex items-center gap-2">
                Explore Software
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </span>
            </Button>
          </div>

          {/* Social Buttons - Responsive grid */}
          <div
            ref={socialGridRef}
            className="grid gap-2 sm:gap-3 mb-8"
            style={{ gridTemplateColumns: useTwoColumns ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))' }}
          >
            {socialLinks.map((social, index) => (
              <button
                key={index}
                onClick={() => window.open(social.link, '_blank')}
                className="w-full px-3 py-2.5 sm:px-4 bg-[var(--bg-surface)] hover:bg-[var(--chip-bg)] border border-[var(--divider)] text-[var(--text-primary)] rounded-xl transition-all font-['Inter',sans-serif] flex items-start gap-2 shadow-sm hover:shadow-md group text-xs sm:text-sm text-left"
                style={{ fontWeight: 500 }}
              >
                <span className="mt-0.5 transition-transform group-hover:scale-110 text-[var(--text-primary)]">
                  {social.icon}
                </span>
                <span className="flex-1 min-w-0 leading-tight break-words">{social.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Avatar */}
        <div className="hidden lg:flex items-center justify-center relative mx-auto">
          <div className="relative w-full max-w-lg">
            <div className="animate-float">
              <div className="relative">
                {/* Glowing background shadow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFB3C1] via-[#B3D9FF] to-[#E8D4FF] rounded-full blur-3xl opacity-70 scale-110"></div>

                {/* Avatar Image */}
                <img
                  src={avatarImage}
                  alt="Miyomi Mascot"
                  height={280}
                  width={280}
                  className="relative z-10 object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Decorative elements around avatar */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-[#FFB3C1] to-transparent rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#B3D9FF] to-transparent rounded-full blur-2xl animate-pulse delay-300"></div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6 mb-16 relative z-10">
        {features.map((feature, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate?.(feature.path)}
            className="group feature-card relative overflow-hidden p-4 sm:p-6 bg-[var(--bg-surface)] border border-[var(--divider)] rounded-2xl hover:shadow-lg transition-all text-left"
            style={{ boxShadow: '0 6px 20px 0 rgba(0,0,0,0.08)' }}
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

            <div className="relative z-10 flex items-center gap-4">
              <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                {React.cloneElement(feature.icon, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-[var(--text-primary)] font-['Poppins',sans-serif] mb-0.5 truncate"
                  style={{ fontSize: '16px', fontWeight: 700 }}
                >
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] font-['Inter',sans-serif] text-xs sm:text-sm leading-snug line-clamp-2 sm:line-clamp-3">
                  {feature.description}
                </p>
              </div>
              {/* Arrow indicator */}
              <div className="text-[var(--brand)] group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0">
                &rarr;
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              whileHover={{ y: -6, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.(stat.path)}
              className="group relative overflow-hidden p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--divider)] rounded-2xl text-center hover:shadow-lg transition-all hover:border-[var(--brand)]"
              style={{ boxShadow: '0 6px 20px 0 rgba(0,0,0,0.08)' }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute -top-10 -right-8 w-28 h-28 rounded-full blur-3xl transition-opacity duration-500 ${stat.glow} group-hover:opacity-80`} />
                <div className={`absolute -bottom-12 -left-10 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 ${stat.glowAlt} opacity-60 group-hover:opacity-90`} />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-black/10 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div
                  className="text-[var(--text-primary)] font-['Poppins',sans-serif] group-hover:scale-110 transition-transform"
                  style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800 }}
                >
                  {stat.count}
                </div>
                <div className="text-[var(--text-secondary)] font-['Inter',sans-serif]" style={{ fontSize: '14px', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
