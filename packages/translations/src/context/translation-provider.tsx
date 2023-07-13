import React, { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { getLanguage, initializeTranslations } from '../utils/i18next';
import { Environment, Language } from '../utils/config';

type TranslationData = {
    environment: Environment;
    current_language: Language;
    setCurrentLanguage: React.Dispatch<React.SetStateAction<Language>>;
};

const TranslationDataContext = React.createContext<TranslationData | null>(null);

type TranslationProviderProps = {
    children?: ReactNode;
    environment?: Environment;
    onInit?: (lang: Language) => void;
};

export const TranslationProvider = ({ children, onInit, environment = 'production' }: TranslationProviderProps) => {
    const [current_language, setCurrentLanguage] = React.useState<Language>(getLanguage() as Language);

    React.useEffect(() => {
        initializeTranslations();
        if (typeof onInit === 'function') {
            onInit(current_language);
        }
    }, [current_language, onInit]);

    return (
        <I18nextProvider i18n={i18n}>
            <TranslationDataContext.Provider value={{ current_language, setCurrentLanguage, environment }}>
                <React.Suspense fallback={<React.Fragment />}>{children}</React.Suspense>
            </TranslationDataContext.Provider>
        </I18nextProvider>
    );
};

export const useTranslationContext = () => {
    const translation_context = React.useContext(TranslationDataContext);
    if (!translation_context) {
        throw new Error('useTranslation() must be used within the TranslationProvider');
    }
    return translation_context;
};
