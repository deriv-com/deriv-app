import React, { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, {
    getAllowedLanguages,
    getInitialLanguage,
    loadIncontextTranslation,
    loadLanguageJson,
    switchLanguage,
} from '../utils/i18next';
import { Environment, Language, LanguageData } from '../utils/config';

type TranslationData = {
    environment: Environment;
    current_language: Language;
    setCurrentLanguage: React.Dispatch<React.SetStateAction<Language>>;
    allowed_language: Partial<LanguageData>;
    setAllowedLanguage: React.Dispatch<React.SetStateAction<Partial<LanguageData>>>;
};

export const TranslationDataContext = React.createContext<TranslationData | null>(null);

type TranslationProviderProps = {
    children?: ReactNode;
    environment?: Environment;
    onInit?: (lang: Language) => void;
};

export const TranslationProvider = ({ children, onInit, environment = 'production' }: TranslationProviderProps) => {
    const [allowed_language, setAllowedLanguage] = React.useState<Partial<LanguageData>>(
        getAllowedLanguages(environment)
    );
    const [current_language, setCurrentLanguage] = React.useState<Language>(
        getInitialLanguage(environment) as Language
    );

    React.useEffect(() => {
        const initializeTranslations = async () => {
            if (environment === 'staging' || environment === 'local') {
                loadIncontextTranslation(current_language);
            }
            await loadLanguageJson(current_language);
            await switchLanguage(current_language, environment);
        };

        initializeTranslations();
        if (typeof onInit === 'function') {
            onInit(current_language);
        }
    }, [current_language, environment, onInit]);

    return (
        <I18nextProvider i18n={i18n}>
            <TranslationDataContext.Provider
                value={{ environment, current_language, setCurrentLanguage, allowed_language, setAllowedLanguage }}
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
