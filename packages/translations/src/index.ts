import { Localize } from './components';
import { TranslationProvider } from './context/translation-provider';
import useLanguageSettings from './hooks/use-language-settings';
import { localize } from './utils/localize';
import {
    switchLanguage,
    getAllowedLanguages,
    getInitialLanguage,
    getLanguage,
    initializeTranslations,
} from './utils/i18next';
import type { Language } from './utils/config';

export {
    getAllowedLanguages,
    getInitialLanguage,
    getLanguage,
    initializeTranslations,
    Localize,
    localize,
    switchLanguage,
    TranslationProvider,
    useLanguageSettings,
};

export type { Language };
