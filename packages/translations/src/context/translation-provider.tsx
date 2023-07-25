import React, { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, {
    getAllowedLanguages,
    getInitialLanguage,
    loadIncontextTranslation,
    setEnvironment,
    switchLanguage,
} from '../utils/i18next';
import { Environment, Language, LanguageData } from '../utils/config';

type TranslationData = {
    environment: Environment;
    current_language: Language;
    setCurrentLanguage: React.Dispatch<React.SetStateAction<Language>>;
    allowed_languages: Partial<LanguageData>;
    setAllowedLanguages: React.Dispatch<React.SetStateAction<Partial<LanguageData>>>;
    is_loading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    websocket?: Record<string, any>;
};

export const TranslationDataContext = React.createContext<TranslationData | null>(null);

type TranslationProviderProps = {
    children?: ReactNode;
    environment?: Environment;
    onInit?: (lang: Language) => void;
    websocket?: Record<string, any>;
};

export const TranslationProvider = ({
    children,
    onInit,
    websocket,
    environment = 'production',
}: TranslationProviderProps) => {
    const [is_loading, setIsLoading] = React.useState(false);
    const [allowed_languages, setAllowedLanguages] = React.useState<Partial<LanguageData>>(
        getAllowedLanguages(environment)
    );
    const [current_language, setCurrentLanguage] = React.useState<Language>(
        getInitialLanguage(environment) as Language
    );

    setEnvironment(environment);

    React.useEffect(() => {
        const getLanguageSettings = async () => {
            if (websocket?.authorized) {
                const response = await websocket.authorized.send({ get_settings: 1 });
                const { preferred_language } = response.get_settings;
                setCurrentLanguage(preferred_language);
            }
        };
        getLanguageSettings();
    }, [websocket]);

    React.useEffect(() => {
        const initializeTranslations = async () => {
            if (environment === 'staging' || environment === 'local') {
                loadIncontextTranslation(current_language);
            }

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
                value={{
                    environment,
                    current_language,
                    setCurrentLanguage,
                    allowed_languages,
                    setAllowedLanguages,
                    is_loading,
                    setIsLoading,
                    websocket,
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
