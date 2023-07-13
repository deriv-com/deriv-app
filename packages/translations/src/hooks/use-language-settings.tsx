import { switchLanguage } from '../utils/i18next';
import { Language, STORE_LANGUAGE_KEY } from '../utils/config';
import { useTranslationContext } from '../context/translation-provider';

type UseLanguageSettings = {
    onChange?: (lang: Language) => void | Promise<void>;
    onComplete?: (lang: Language) => void | Promise<void>;
};

const useLanguageSettings = ({ onChange, onComplete }: UseLanguageSettings = {}) => {
    const { current_language, setCurrentLanguage } = useTranslationContext();

    const handleChangeLanguage = async (selected_lang: Language) => {
        if (selected_lang === 'EN') {
            window.localStorage.setItem(STORE_LANGUAGE_KEY, selected_lang);
        }

        if (typeof onChange === 'function') await onChange(selected_lang);

        const current_url = new URL(window.location.href);
        if (selected_lang === 'EN') {
            current_url.searchParams.delete('lang');
        } else {
            current_url.searchParams.set('lang', selected_lang);
        }

        window.history.pushState({ path: current_url.toString() }, '', current_url.toString());
        await switchLanguage(selected_lang, async () => {
            setCurrentLanguage(selected_lang);

            if (typeof onComplete === 'function') await onComplete(selected_lang);
        });
    };

    return { current_language, handleChangeLanguage };
};

export default useLanguageSettings;
