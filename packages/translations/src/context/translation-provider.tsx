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
import { useWS } from '../../../shared/src/services/index';

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
    onInit?: (lang: Language) => void;
};

export const TranslationProvider = ({ children, onInit, environment = 'production' }: TranslationProviderProps) => {
    const websocket = useWS();
    const [is_loading, setIsLoading] = React.useState(false);
    const [allowed_languages, setAllowedLanguages] = React.useState<Partial<LanguageData>>(
        getAllowedLanguages(environment)
    );
    const [current_language, setCurrentLanguage] = React.useState<Language>(
        getInitialLanguage(environment) as Language
    );

    setEnvironment(environment);

    React.useEffect(() => {
        const setLanguageSettings = async () => {
            setIsLoading(true);
            await switchLanguage(current_language, environment, async () => {
                setCurrentLanguage(current_language);
                if (websocket) websocket.closeAndOpenNewConnection(current_language);
            });
            await websocket.wait('get_account_status');
            await websocket.authorized.send({
                set_settings: 1,
                preferred_language: current_language,
            });
        };
        setLanguageSettings();
        setIsLoading(false);
    }, [current_language, environment, websocket, websocket.authorized]);

    React.useEffect(() => {
        const initializeTranslations = async () => {
            await websocket.wait('get_account_status');
            const response = await websocket.authorized.send({ get_settings: 1 });

            const { preferred_language } = response.get_settings;
            const initial_language = preferred_language || getInitialLanguage(environment);

            if ((environment === 'staging' || environment === 'local') && initial_language === 'ACH') {
                loadIncontextTranslation();
            }
            if (typeof onInit === 'function') {
                onInit(initial_language);
            }
            setCurrentLanguage(initial_language);
        };

        initializeTranslations();
    }, [environment, onInit, websocket]);

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
