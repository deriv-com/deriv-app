import React from 'react';

const useIsRtl = () => {
    const i18nLanguage = localStorage.getItem('i18n_language');

    const checkRtl = useCallback(() => {
        return i18nLanguage === 'AR';
    }, [i18nLanguage]);

    const [is_rtl, setIsRtl] = useState<boolean>(() => checkRtl());

    useEffect(() => {
        setIsRtl(checkRtl());
    }, [checkRtl]);

    return is_rtl;
};

export default useIsRtl;
