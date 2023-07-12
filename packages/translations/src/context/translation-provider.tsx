import React, { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { getLanguage } from '../utils/i18next';
import useOnLoadTranslation from '../hooks/use-onload-translation';
import { Environment, Language } from '../utils/config';

type TranslationData = {
    current_language: Language;
    setCurrentLanguage: React.Dispatch<React.SetStateAction<Language>>;
    environment: Environment;
};

const TranslationDataContext = React.createContext<TranslationData | null>(null);

type TranslationProviderProps = {
    children: ReactNode;
    environment: Environment;
};

export const TranslationProvider = ({ children, environment = 'production' }: TranslationProviderProps) => {
    const [is_translation_loaded] = useOnLoadTranslation();
    const [current_language, setCurrentLanguage] = React.useState<Language>(getLanguage() as Language);

    return (
        <I18nextProvider i18n={i18n}>
            <TranslationDataContext.Provider value={{ current_language, setCurrentLanguage, environment }}>
                {is_translation_loaded ? children : <React.Fragment />}
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
