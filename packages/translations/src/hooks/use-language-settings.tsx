import { useTranslation } from 'react-i18next';
import { Language } from '../utils/config';
import { useTranslationContext } from '../context/translation-provider';

const useLanguageSettings = () => {
    const { i18n } = useTranslation();
    const { current_language, setCurrentLanguage, is_loading } = useTranslationContext();

    const handleChangeLanguage = async (selected_lang: Language) => {
        setCurrentLanguage(selected_lang);
    };

    const isRTL = () => i18n.dir() === 'rtl';

    return { is_loading, current_language, handleChangeLanguage, isRTL };
};

export default useLanguageSettings;
