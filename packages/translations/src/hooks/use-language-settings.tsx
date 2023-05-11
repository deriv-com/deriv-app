import React from 'react';
import { changeLanguage, getLanguage } from '../utils/i18next';
import { Language, STORE_LANGUAGE_KEY } from '../utils/config';

const useLanguageSettings = (): [Language, (lang: Language) => void] => {
    const [current_language, setCurrentLanguage] = React.useState<Language>(getLanguage() as Language);

    const handleChangeLanguage = async (selected_lang: Language, onChange?: () => void, onComplete?: () => void) => {
        if (selected_lang === 'EN') {
            window.localStorage.setItem(STORE_LANGUAGE_KEY, selected_lang);
        }
        if (typeof onChange === 'function') onChange();

        const current_url = new URL(window.location.href);
        if (selected_lang === 'EN') {
            current_url.searchParams.delete('lang');
        } else {
            current_url.searchParams.set('lang', selected_lang);
        }

        window.history.pushState({ path: current_url.toString() }, '', current_url.toString());
        await changeLanguage(selected_lang, () => {
            setCurrentLanguage(selected_lang);
            if (typeof onComplete === 'function') onComplete();
        });
    };

    return [current_language, handleChangeLanguage];
};

export default useLanguageSettings;
