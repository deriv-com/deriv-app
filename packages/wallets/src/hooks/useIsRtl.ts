import { useTranslations } from '@deriv-com/translations';

const useIsRtl = () => {
    const { currentLang } = useTranslations();
    return currentLang === 'AR';
};

export default useIsRtl;
