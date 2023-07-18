import { useTranslationContext } from '../context/translation-provider';

const useLanguageChecks = () => {
    const { allowed_language } = useTranslationContext();

    return { allowed_language };
};

export default useLanguageChecks;
