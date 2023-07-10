import { switchLanguage } from '../utils/i18next';
import { Language, STORE_LANGUAGE_KEY } from '../utils/config';
import { useTranslation } from '../context/translation-provider';

type UseLanguageSettings = {
    onChanging?: () => void;
    onChange?: () => void;
};

const useLanguageSettings = ({ onChanging, onChange }: UseLanguageSettings = {}) => {
    const { current_language, setCurrentLanguage } = useTranslation();

    const handleChangeLanguage = async (selected_lang: Language) => {
        if (selected_lang === 'EN') {
            window.localStorage.setItem(STORE_LANGUAGE_KEY, selected_lang);
        }
        if (typeof onChanging === 'function') onChanging();

        const current_url = new URL(window.location.href);
        if (selected_lang === 'EN') {
            current_url.searchParams.delete('lang');
        } else {
            current_url.searchParams.set('lang', selected_lang);
        }

        window.history.pushState({ path: current_url.toString() }, '', current_url.toString());
        await switchLanguage(selected_lang, () => {
            setCurrentLanguage(selected_lang);
            if (typeof onChange === 'function') onChange();
        });
    };

    return { current_language, handleChangeLanguage };
};

export default useLanguageSettings;
