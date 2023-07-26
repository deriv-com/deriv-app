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
    websocket: Record<string, any>;
    onInit?: (lang: Language) => void;
};

export const TranslationProvider = ({
    children,
    onInit,
    websocket,
    environment = 'production',
}: TranslationProviderProps) => {
    const first_load = React.useRef(true);

    const [is_loading, setIsLoading] = React.useState(false);
    const [allowed_languages, setAllowedLanguages] = React.useState<Partial<LanguageData>>(
        getAllowedLanguages(environment)
    );
    const [current_language, setCurrentLanguage] = React.useState<Language>(
        getInitialLanguage(environment) as Language
    );

    const initializeTranslations = async () => {
        await websocket.wait('get_account_status');
        const response = await websocket.authorized.send({ get_settings: 1 });
        const { preferred_language } = response.get_settings;
        const initial_language = preferred_language || getInitialLanguage(environment);
        updateURLLanguage(initial_language);

        if ((environment === 'staging' || environment === 'local') && initial_language === 'ACH') {
            loadIncontextTranslation();
        }
        if (typeof onInit === 'function') {
            onInit(initial_language);
        }
        await switchLanguage(initial_language, environment, async () => {
            setCurrentLanguage(initial_language);
            first_load.current = false;
        });
    };

    const setLanguageSettings = React.useCallback(
        async (lang: Language) => {
            setIsLoading(true);
            await switchLanguage(lang, environment, async () => {
                setCurrentLanguage(lang);
                if (websocket) websocket.closeAndOpenNewConnection(lang);
            });
            await websocket.wait('get_account_status');
            await websocket.authorized.send({
                set_settings: 1,
                preferred_language: lang,
            });
            setIsLoading(false);
        },
        [environment, websocket]
    );

    React.useEffect(() => {
        initializeTranslations();
    }, []);

    React.useEffect(() => {
        if (!first_load.current) {
            setLanguageSettings(current_language);
            updateURLLanguage(current_language);
        }
    }, [current_language, setLanguageSettings]);

    React.useEffect(() => {
        setEnvironment(environment);
    }, [environment]);

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
