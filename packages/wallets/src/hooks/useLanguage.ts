import { useEffect, useState } from 'react';
import { getInitialLanguage } from '@deriv-com/translations';
import { TLanguageType } from '../types';

const useLanguage = (preferredLanguage: TLanguageType | null) => {
    const [language, setLanguage] = useState<TLanguageType>(() => {
        return preferredLanguage || 'EN';
    });
    const initialLang = getInitialLanguage() as TLanguageType;

    useEffect(() => {
        setLanguage(initialLang);
    }, [initialLang]);

    return language;
};

export default useLanguage;
