import React, { ReactNode } from 'react';
import useLanguageSettings from '../hooks/use-language-settings';
import { Language } from '../utils/config';

type TranslationSettingsData = {
    current_language: Language;
    handleChangeLanguage: (lang: Language, onChange?: () => void, onComplete?: () => void) => void;
};

const TranslationSettingsContext = React.createContext<TranslationSettingsData | null>(null);

type TranslationSettingsProviderProps = {
    children: ReactNode;
};

const TranslationSettingsProvider = ({ children }: TranslationSettingsProviderProps) => {
    const [current_language, handleChangeLanguage] = useLanguageSettings();

    return (
        <TranslationSettingsContext.Provider value={{ current_language, handleChangeLanguage }}>
            {children}
        </TranslationSettingsContext.Provider>
    );
};

export default TranslationSettingsProvider;
