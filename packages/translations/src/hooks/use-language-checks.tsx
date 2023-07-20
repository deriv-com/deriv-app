import { useTranslationContext } from '../context/translation-provider';

const useLanguageChecks = () => {
    const { allowed_languages } = useTranslationContext();

    return { allowed_languages };
};

export default useLanguageChecks;
