import { Language } from '../utils/config';
import { useTranslationContext } from '../context/translation-provider';

const useLanguageSettings = () => {
    const { current_language, setCurrentLanguage, is_loading } = useTranslationContext();

    const handleChangeLanguage = async (selected_lang: Language) => {
        setCurrentLanguage(selected_lang);
    };

    return { is_loading, current_language, handleChangeLanguage };
};

export default useLanguageSettings;
