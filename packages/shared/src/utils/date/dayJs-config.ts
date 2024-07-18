import dayjs from 'dayjs';

// Localize moment instance with specific object
export const setLocale = async (lang: string) => {
    const hasEnMomentLocale = ['AR', 'BN', 'SI']; // This is the list of locales that have the same format as en
    let locale = lang.toLowerCase().replace('_', '-');
    if (hasEnMomentLocale.includes(lang)) locale = 'en';
    try {
        const localeModule = await import(`dayjs/locale/${locale}.js`);
        dayjs.locale(localeModule.default);
    } catch (error) {
        console.error(`Locale ${locale} could not be loaded`, error);
    }
};
