import christmasLogo from '../assets/hugme-christmas.png';
import christmasAvatar from '../assets/polic-christmas.png';

export const SEASONAL_CONFIG = {
    // Master switch - set to false to disable everything instantly
    enabled: true,

    // Theme identifier
    themeName: 'christmas',

    assets: {
        logo: christmasLogo,
        homeAvatar: christmasAvatar,
        // Add others here as needed
    },

    // Optional: Auto-enable based on date
    autoSchedule: {
        startMonth: 11, // December (0-indexed)
        startDay: 1,
        endMonth: 0,    // January
        endDay: 7
    }
};

// Helper to check if active
export const isSeasonalActive = () => {
    if (!SEASONAL_CONFIG.enabled) return false;

    // If you want date checking:
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    // Simple logic for Dec-Jan window
    const isDec = currentMonth === 11;
    const isJan = currentMonth === 0 && currentDay <= 7;

    return isDec || isJan;
};