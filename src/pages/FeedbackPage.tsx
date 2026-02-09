import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    AlertCircle,
    XOctagon,
    Lightbulb,
    Heart,
    MessageSquare,
    ChevronLeft,
    Send,
    ArrowLeft,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

type FeedbackOption = {
    id: string;
    label: string;
    icon: typeof Plus;
    accent: string;
    helper?: string;
};

const feedbackOptions: FeedbackOption[] = [
    { id: 'submit', label: 'Submit link', icon: Plus, accent: '#a855f7', helper: 'Share a new source with everyone.' },
    { id: 'update', label: 'Update link', icon: AlertCircle, accent: '#fb7185', helper: 'Let us know if something changed.' },
    { id: 'report', label: 'Report bad / dead link', icon: XOctagon, accent: '#f97316', helper: 'Flag a broken or unsafe link.' },
    { id: 'suggest', label: 'Suggest edit', icon: Lightbulb, accent: '#facc15', helper: 'Recommend improvements or tweaks.' },
    { id: 'love', label: 'Love the wiki', icon: Heart, accent: '#ec4899', helper: 'Tell us what is working well.' },
    { id: 'other', label: 'Something else', icon: MessageSquare, accent: '#60a5fa', helper: 'Anything that does not fit above.' },
];

export function FeedbackPage() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);

    const handleSelect = (optionId: string) => {
        setSelectedOption(optionId);
    };

    const handleReset = () => {
        setSelectedOption(null);
        setMessage('');
    };

    const handleSubmit = async () => {
        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        if (!checkbox1 || !checkbox2) {
            toast.error('Please check both confirmation boxes');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: selectedOption,
                    message: message.trim(),
                    page: 'feedback-page',
                    timestamp: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                toast.success('Feedback sent successfully!');
                // Navigate back or to home
                navigate(-1);
            } else {
                toast.error('Failed to send feedback. Please try again.');
            }
        } catch (error) {
            console.error('Feedback submission error:', error);
            toast.error('Failed to send feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedOptionData = feedbackOptions.find((option) => option.id === selectedOption);
    const accentColor = selectedOptionData?.accent ?? 'var(--brand)';
    const canSubmit = checkbox1 && checkbox2 && message.trim().length > 0 && selectedOption;

    const getPlaceholder = (optionId: string) => {
        switch (optionId) {
            case 'submit':
                return 'Tip: Did you know that starring our GitHub repo doubles the chances that your feedback will be read?';
            case 'update':
                return 'Tip: Please include the old and new information if possible.';
            case 'report':
                return 'Tip: Please specify the exact link and what is wrong with it.';
            case 'suggest':
                return 'Tip: Describe your suggestion clearly and why it would be helpful.';
            case 'love':
                return 'Tip: We love hearing positive feedback! Tell us what you enjoy most.';
            case 'other':
                return 'Tip: Describe your inquiry or issue in detail.';
            default:
                return 'Enter your message here...';
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-['Inter',sans-serif] text-sm"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1
                    className="text-[var(--text-primary)] font-['Poppins',sans-serif] mb-2"
                    style={{ fontSize: 'clamp(24px, 5vw, 32px)', lineHeight: '1.2', fontWeight: 700 }}
                >
                    Send feedback anonymously
                </h1>
                <p className="text-[var(--text-secondary)] font-['Inter',sans-serif] text-sm">
                    Your feedback helps us improve. Choose a category and share your thoughts.
                </p>
            </div>

            {/* Feedback Card */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-[var(--divider)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
            >
                {/* Category Selection */}
                {!selectedOption && (
                    <>
                        <h3
                            className="font-['Poppins',sans-serif] text-[var(--text-primary)] mb-4"
                            style={{ fontSize: '18px', fontWeight: 600 }}
                        >
                            What do you want to share?
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {feedbackOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <motion.button
                                        key={option.id}
                                        onClick={() => handleSelect(option.id)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 rounded-full border border-[var(--divider)] bg-[var(--bg-elev-1)] px-3 py-1.5 font-['Inter',sans-serif] text-xs text-[var(--text-primary)] shadow-sm transition-colors hover:border-[var(--brand)] hover:text-[var(--text-primary-strong)] sm:text-sm"
                                        style={{
                                            letterSpacing: '0.01em',
                                            width: 'max-content',
                                        }}
                                    >
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: `${option.accent}20` }}>
                                            <Icon className="h-3.5 w-3.5" style={{ color: option.accent }} />
                                        </span>
                                        <span className="whitespace-nowrap">{option.label}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Selected Option Form */}
                {selectedOption && selectedOptionData && (
                    <div className="space-y-2">
                        {/* Selected Option Header */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span
                                    className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                                    style={{ backgroundColor: `${accentColor}18` }}
                                >
                                    {(() => {
                                        const Icon = selectedOptionData.icon;
                                        return <Icon className="h-5 w-5" style={{ color: accentColor }} />;
                                    })()}
                                </span>
                                <h4
                                    className="font-['Poppins',sans-serif] text-[var(--text-primary)]"
                                    style={{ fontSize: '20px', fontWeight: 600, color: accentColor }}
                                >
                                    {selectedOptionData.label}
                                </h4>
                            </div>
                            <button
                                onClick={handleReset}
                                className="rounded-full border border-[var(--divider)] px-3 py-1.5 font-['Inter',sans-serif] text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--chip-bg)] hover:text-[var(--text-primary)]"
                            >
                                Change
                            </button>
                        </div>

                        {/* Textarea */}
                        <textarea
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder={getPlaceholder(selectedOption)}
                            className="w-full rounded-xl border border-[var(--divider)] bg-[var(--bg-elev-1)] p-4 font-['Inter',sans-serif] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--brand)] focus:outline-none"
                            style={{ minHeight: '130px', resize: 'vertical' }}
                        />

                        {/* Footer Text */}
                        <p className="font-['Inter',sans-serif] text-sm text-[var(--text-secondary)]">
                            If you want a reply to your feedback, feel free to mention a contact in the message.
                        </p>

                        {/* Checkboxes */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    cursor: 'pointer',
                                }}
                            >
                                <div
                                    onClick={() => setCheckbox1(!checkbox1)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '6px',
                                        border: `2px solid ${checkbox1 ? 'var(--brand)' : 'var(--divider)'}`,
                                        backgroundColor: checkbox1 ? 'var(--brand)' : 'var(--bg-elev-1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease',
                                        flexShrink: 0,
                                    }}
                                >
                                    {checkbox1 && (
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={checkbox1}
                                    onChange={(e) => setCheckbox1(e.target.checked)}
                                    style={{ display: 'none' }}
                                />
                                <span
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: '13px',
                                        lineHeight: '1.5',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    I understand that Miyomi is not affiliated with any listed apps, and app-related issues must be reported directly to the respective app developers.
                                </span>
                            </label>

                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    cursor: 'pointer',
                                }}
                            >
                                <div
                                    onClick={() => setCheckbox2(!checkbox2)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '6px',
                                        border: `2px solid ${checkbox2 ? 'var(--brand)' : 'var(--divider)'}`,
                                        backgroundColor: checkbox2 ? 'var(--brand)' : 'var(--bg-elev-1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease',
                                        flexShrink: 0,
                                    }}
                                >
                                    {checkbox2 && (
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={checkbox2}
                                    onChange={(e) => setCheckbox2(e.target.checked)}
                                    style={{ display: 'none' }}
                                />
                                <span
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: '13px',
                                        lineHeight: '1.5',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    I confirm that this feedback is constructive and relevant to the Miyomi website.
                                </span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-12">
                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center rounded-xl border border-[var(--divider)] bg-[var(--bg-elev-1)] px-4 py-2.5 font-['Inter',sans-serif] text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--chip-bg)]"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!canSubmit || isSubmitting}
                                className="flex flex-1 items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-2.5 font-['Inter',sans-serif] text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Feedback'}
                                <Send className="h-4 w-4 ml-2" />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
