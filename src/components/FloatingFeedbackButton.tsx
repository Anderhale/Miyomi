import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Github, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';

export function FloatingFeedbackButton() {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine if FAB should be visible based on current route
    const shouldShowFab = () => {
        const pathname = location.pathname;

        // Only show on exact matches for these routes
        const allowedRoutes = ['/software', '/extensions', '/faq'];
        return allowedRoutes.includes(pathname);
    };

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        }

        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded]);

    const handleFabClick = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleAnonymousFeedback = () => {
        setIsExpanded(false);
        navigate('/feedback');
    };

    const handleGitHubFeedback = () => {
        setIsExpanded(false);
        window.open('https://github.com/tas33n/Miyomi/issues/new', '_blank', 'noopener,noreferrer');
    };

    // Don't render if not on allowed routes
    if (!shouldShowFab()) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '12px',
            }}
        >
            {/* Expanded options - stacked vertically above FAB */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        {/* Anonymous Feedback Option */}
                        <motion.button
                            onClick={handleAnonymousFeedback}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '9999px',
                                border: '1px solid var(--divider)',
                                backgroundColor: 'var(--bg-surface)',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                                }}
                            >
                                <MessageCircle style={{ width: '16px', height: '16px', color: '#a855f7' }} />
                            </span>
                            <span
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: 'var(--text-primary)',
                                }}
                            >
                                Feedback anonymously
                            </span>
                        </motion.button>

                        {/* GitHub Option */}
                        <motion.button
                            onClick={handleGitHubFeedback}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '9999px',
                                border: '1px solid var(--divider)',
                                backgroundColor: 'var(--bg-surface)',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                <Github style={{ width: '16px', height: '16px', color: 'var(--text-primary)' }} />
                            </span>
                            <span
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: 'var(--text-primary)',
                                }}
                            >
                                Feedback via GitHub
                            </span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main FAB Button */}
            <motion.button
                onClick={handleFabClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: isExpanded ? '1px solid var(--divider)' : 'none',
                    backgroundColor: isExpanded ? 'var(--bg-surface)' : 'var(--brand)',
                    boxShadow: isExpanded
                        ? '0 8px 32px rgba(0, 0, 0, 0.15)'
                        : '0 8px 32px rgba(99, 102, 241, 0.35)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                }}
                aria-label={isExpanded ? 'Close feedback options' : 'Open feedback options'}
            >
                <AnimatePresence mode="wait">
                    {isExpanded ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <X style={{ width: '24px', height: '24px', color: 'var(--text-primary)' }} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="message"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <MessageSquare style={{ width: '24px', height: '24px', color: 'white' }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
