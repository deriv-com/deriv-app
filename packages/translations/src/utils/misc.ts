import { Language } from './config';

/**
 * Updates the language parameter in the URL based on the provided language.
 *
 * @param {Language} lang - The language to be set in the URL.
 * @param {string} [url=window.location.href] - The URL to be updated. Default value is the current url.
 * @returns {string} - The updated URL with the modified language parameter.
 */
export const updateURLLanguage = (lang: Language, url: string = window.location.href) => {
    const current_url = new URL(url);

    if (lang === 'EN') {
        current_url.searchParams.delete('lang');
    } else {
        current_url.searchParams.set('lang', lang);
    }

    window.history.pushState({ path: current_url.toString() }, '', current_url.toString());
};
