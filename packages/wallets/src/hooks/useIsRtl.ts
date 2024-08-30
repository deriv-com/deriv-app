import { useCallback, useEffect, useState } from 'react';

const useIsRtl = () => {
    const i18nLanguage = localStorage.getItem('i18n_language');

    const checkRtl = useCallback(() => {
        return i18nLanguage === 'AR';
    }, [i18nLanguage]);

    const [isRtl, setIsRtl] = useState<boolean>(() => checkRtl());

    useEffect(() => {
        setIsRtl(checkRtl());
    }, [checkRtl]);

    return isRtl;
};

export default useIsRtl;
