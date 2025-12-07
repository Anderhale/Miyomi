
export const SEASONAL_CONFIG = {
    // Master Switch
    enabled: true,

    // This class name will be added to <body>
    themeName: 'christmas',

    assets: {
        // Fallback logic handled in hooks, these are the overrides
        logo: '/hugme-christmas.png',
        homeAvatar: '/polic-christmas.png',
    },

    // Animation settings for the component
    effects: {
        snowCount: 20, // Reduced for cleaner look with images
        wind: [-0.2, 1.0] as [number, number], // Gentle breeze
        lowPower: {
            snowCount: 10,
            imageCount: 5, // Limit unique snowflake images
            standardSnowCount: 20 // Reduced standard snow for low power
        }
    }
};

export const isSeasonalActive = () => SEASONAL_CONFIG.enabled;