import React, { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../utils/i18n-instance';
import {
    getAllowedLanguages,
    getInitialLanguage,
    loadIncontextTranslation,
    setEnvironment,
    switchLanguage,
} from '../utils/i18next';
import { Environment, Language, LanguageData } from '../utils/config';
import { updateURLLanguage } from '../utils/misc';

type TranslationData = {
    environment: Environment;
    current_language: Language;
    setCurrentLanguage: React.Dispatch<React.SetStateAction<Language>>;
    allowed_languages: Partial<LanguageData>;
    setAllowedLanguages: React.Dispatch<React.SetStateAction<Partial<LanguageData>>>;
    is_loading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TranslationDataContext = React.createContext<TranslationData | null>(null);

type TranslationProviderProps = {
    children?: ReactNode;
    environment?: Environment;
    onInit?: (lang: Language) => void | Promise<void>;
};

export const TranslationProvider = ({ children, environment = 'production', onInit }: TranslationProviderProps) => {
    const [is_loading, setIsLoading] = React.useState(false);
    const [allowed_languages, setAllowedLanguages] = React.useState<Partial<LanguageData>>(
        getAllowedLanguages(environment)
    );
    const [current_language, setCurrentLanguage] = React.useState<Language>(
        getInitialLanguage(environment) as Language
    );

    const initializeTranslations = React.useCallback(async () => {
        setIsLoading(true);
        const initial_language = getInitialLanguage(environment);
        if (typeof onInit === 'function') await onInit(initial_language);

        if ((environment === 'staging' || environment === 'local') && initial_language === 'ACH') {
            loadIncontextTranslation();
        }
        await switchLanguage(initial_language, environment, () => {
            setCurrentLanguage(initial_language);
            updateURLLanguage(initial_language);
            setIsLoading(false);
        });
    }, [environment, onInit]);

    const setLanguageSettings = React.useCallback(
        async (lang: Language) => {
            setIsLoading(true);
            await switchLanguage(lang, environment, () => setIsLoading(false));
        },
        [environment]
    );

    React.useEffect(() => {
        initializeTranslations();
        setEnvironment(environment);
    }, [environment, initializeTranslations]);

    React.useEffect(() => {
        updateURLLanguage(current_language);
        setLanguageSettings(current_language);
        document.documentElement.setAttribute('lang', current_language);
    }, [current_language, setLanguageSettings]);

    return (
        <I18nextProvider i18n={i18n}>
            <TranslationDataContext.Provider
                value={{
                    environment,
                    current_language,
                    setCurrentLanguage,
                    allowed_languages,
                    setAllowedLanguages,
                    is_loading,
                    setIsLoading,
                }}
            >
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
