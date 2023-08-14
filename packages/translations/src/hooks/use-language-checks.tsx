import { useTranslation } from 'react-i18next';
import { useTranslationContext } from '../context/translation-provider';

const useLanguageChecks = () => {
    const { i18n } = useTranslation();
    const { allowed_languages } = useTranslationContext();

    const isRTL = () => i18n.dir() === 'rtl';

    return { allowed_languages, isRTL };
};

export default useLanguageChecks;
