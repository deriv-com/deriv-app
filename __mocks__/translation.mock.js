const Localize = ({ i18n_default_text, values }) => {
    // Replace placeholders in the default text with actual values
    const localizedText = i18n_default_text.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] || match);

    return localizedText || null;
};

// Mock for useTranslations hook
const useTranslations = () => ({
    localize: jest.fn((text, args) => {
        return text.replace(/{{(.*?)}}/g, (_, match) => args[match.trim()]);
    }),
    currentLang: 'EN',
});

const localize = jest.fn(text => text);

const getAllowedLanguages = jest.fn(() => ({ EN: 'English', VI: 'Tiếng Việt' }));

export { Localize, localize, useTranslations, getAllowedLanguages };
