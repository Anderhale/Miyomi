"use client";

import { X, ChevronDown, Github, Instagram, Youtube, Facebook, Plus } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';
import logoImage from 'figma:asset/hugme.png';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavbarProps {
  onNavigate?: (path: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [guidesDropdownOpen, setGuidesDropdownOpen] = useState(false);
  const hoverTimeouts = useRef<{ pages: ReturnType<typeof setTimeout> | null; guides: ReturnType<typeof setTimeout> | null }>({
    pages: null,
    guides: null,
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setExpandedSection(null);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      (['pages', 'guides'] as const).forEach((section) => {
        const timeoutId = hoverTimeouts.current[section];
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      });
    };
  }, []);

  const mainNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Software', path: '/software' },
    // { label: 'Websites', path: '/websites' },
    { label: 'Extensions', path: '/extensions' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Communities', path: '/communities' },
    { label: 'About', path: '/about' },
  ];

  const guidesNavItems = [
    { label: 'All Guides', path: '/guides' },
    { label: 'Installation', path: '/guides#installation' },
    { label: 'Configuration', path: '/guides#configuration' },
    { label: 'Troubleshooting', path: '/guides#troubleshooting' },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, label: 'Facebook', link: 'https://www.facebook.com/iitachiyomi' },
    { icon: <Youtube className="w-5 h-5" />, label: 'YouTube', link: 'https://www.youtube.com/@iitachiyomi' },
    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram', link: 'https://www.instagram.com/iitachiyomi/' },
    { icon: <Github className="w-5 h-5" />, label: 'GitHub', link: 'https://github.com/tas33n/miyomi' },
  ];

  const handleClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const clearHoverTimeout = (section: 'pages' | 'guides') => {
    const timeoutId = hoverTimeouts.current[section];
    if (timeoutId) {
      clearTimeout(timeoutId);
      hoverTimeouts.current[section] = null;
    }
  };

  const openDropdown = (section: 'pages' | 'guides') => {
    clearHoverTimeout(section);
    if (section === 'pages') {
      setPagesDropdownOpen(true);
    } else {
      setGuidesDropdownOpen(true);
    }
  };

  const scheduleDropdownClose = (section: 'pages' | 'guides') => {
    clearHoverTimeout(section);
    hoverTimeouts.current[section] = window.setTimeout(() => {
      if (section === 'pages') {
        setPagesDropdownOpen(false);
      } else {
        setGuidesDropdownOpen(false);
      }
      hoverTimeouts.current[section] = null;
    }, 150);
  };

  const renderDropdownItem = (item: { label: string; path: string }) => (
    <DropdownMenuItem
      key={item.path}
      onClick={() => handleClick(item.path)}
      className={`cursor-pointer ${isActive(item.path)
        ? 'text-[var(--brand)] bg-[var(--chip-bg)]'
        : 'text-[var(--text-primary)] hover:bg-[var(--bg-elev-1)]'
        }`}
      style={{ fontWeight: isActive(item.path) ? 600 : 400 }}
    >
      {item.label}
    </DropdownMenuItem>
  );

  return (
    <>
      <nav
        className={`h-16 fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${scrolled
            ? 'bg-[var(--bg-page)]/80 backdrop-blur-xl border-b border-[var(--divider)]/50 shadow-sm'
            : 'bg-transparent'
          }`}
      >
        {/* Navbar Content */}
        <div className="relative z-10 h-full px-4 sm:px-8 lg:px-[120px] flex items-center justify-between w-full gap-4">
          {/* Left Section: Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleClick('/')}
              className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
            >
              <img src={logoImage} alt="Miyomi" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
              <span className="text-[var(--brand)] font-['Poppins',sans-serif] text-lg" style={{ fontWeight: 600 }}>
                Miyomi
              </span>
            </button>
          </div>

          {/* Right Section: Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-4">
            {/* Pages Dropdown - Hover Trigger */}
            <DropdownMenu open={pagesDropdownOpen} onOpenChange={setPagesDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  onPointerDown={(event) => event.preventDefault()}
                  onMouseEnter={() => openDropdown('pages')}
                  onMouseLeave={() => scheduleDropdownClose('pages')}
                  className="flex items-center gap-1 text-sm py-2 px-2 relative transition-colors text-[var(--text-primary)] hover:text-[var(--brand)] font-['Inter',sans-serif]"
                  style={{ fontWeight: 400 }}
                >
                  Pages <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={6}
                onMouseEnter={() => openDropdown('pages')}
                onMouseLeave={() => scheduleDropdownClose('pages')}
                className="w-48 bg-[var(--bg-page)]/90 backdrop-blur-xl border border-[var(--divider)]/50 rounded-xl shadow-sm p-1 transition-all duration-200 ease-out"
              >
                {mainNavItems.map(renderDropdownItem)}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Guides Dropdown - Hover Trigger */}
            <DropdownMenu open={guidesDropdownOpen} onOpenChange={setGuidesDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  onPointerDown={(event) => event.preventDefault()}
                  onMouseEnter={() => openDropdown('guides')}
                  onMouseLeave={() => scheduleDropdownClose('guides')}
                  className="flex items-center gap-1 text-sm py-2 px-2 relative transition-colors text-[var(--text-primary)] hover:text-[var(--brand)] font-['Inter',sans-serif]"
                  style={{ fontWeight: 400 }}
                >
                  Guides <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={6}
                onMouseEnter={() => openDropdown('guides')}
                onMouseLeave={() => scheduleDropdownClose('guides')}
                className="w-48 bg-[var(--bg-page)]/90 backdrop-blur-xl border border-[var(--divider)]/50 rounded-xl shadow-sm p-1 transition-all duration-200 ease-out"
              >
                {guidesNavItems.map(renderDropdownItem)}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Divider */}
            <div className="w-px h-6 bg-[var(--divider)]"></div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Social Links */}
            <div className="flex items-center gap-1">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--text-primary)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[997] md:hidden transition-opacity duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed top-16 left-0 right-0 z-[998] md:hidden transition-all duration-200 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'
          }`}
        style={{
          backgroundColor: 'var(--bg-page)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(var(--bg-page-rgb, 255, 247, 242), 0.9)',
        }}
      >
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-8 py-6">
          {/* Pages Section */}
          <div className="mb-3">
            <button
              onClick={() => toggleSection('pages')}
              className="w-full flex items-center justify-between py-2.5 text-[var(--text-primary)] font-['Inter',sans-serif]"
              style={{ fontWeight: 500 }}
            >
              <span>Pages</span>
              <Plus
                className={`w-5 h-5 transition-transform duration-200 ${expandedSection === 'pages' ? 'rotate-45' : ''
                  }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${expandedSection === 'pages' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="space-y-0.5 mt-2">
                {mainNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleClick(item.path)}
                    className={`w-full text-center py-2 px-4 rounded-lg transition-colors ${isActive(item.path)
                        ? 'text-[var(--brand)] bg-[var(--chip-bg)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elev-1)]'
                      }`}
                    style={{ fontWeight: isActive(item.path) ? 600 : 400 }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-b border-[var(--divider)] mt-3"></div>
          </div>

          {/* Guides Section */}
          <div className="mb-3">
            <button
              onClick={() => toggleSection('guides')}
              className="w-full flex items-center justify-between py-2.5 text-[var(--text-primary)] font-['Inter',sans-serif]"
              style={{ fontWeight: 500 }}
            >
              <span>Guides</span>
              <Plus
                className={`w-5 h-5 transition-transform duration-200 ${expandedSection === 'guides' ? 'rotate-45' : ''
                  }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${expandedSection === 'guides' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="space-y-0.5 mt-2">
                {guidesNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleClick(item.path)}
                    className={`w-full text-center py-2 px-4 rounded-lg transition-colors ${isActive(item.path)
                        ? 'text-[var(--brand)] bg-[var(--chip-bg)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elev-1)]'
                      }`}
                    style={{ fontWeight: isActive(item.path) ? 600 : 400 }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-b border-[var(--divider)] mt-3"></div>
          </div>

          {/* Appearance Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[var(--text-primary)] font-['Inter',sans-serif]" style={{ fontWeight: 500 }}>
                Appearance
              </span>
              <ThemeToggle />
            </div>
          </div>

          {/* Social Icons */}
          <div className="pt-3 border-t border-[var(--divider)]">
            <div className="flex items-center justify-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
