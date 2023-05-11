import { Localize } from './components';
import TranslationProvider from './context/translation-provider';
import TranslationSettings from './context/translation-settings';
import { localize } from './utils/localize';
import {
    changeLanguage,
    getAllLanguages,
    getAllowedLanguages,
    getInitialLanguage,
    getLanguage,
    initializeTranslations,
} from './utils/i18next';

export {
    Localize,
    localize,
    TranslationProvider,
    TranslationSettings,
    changeLanguage,
    getAllLanguages,
    getAllowedLanguages,
    getInitialLanguage,
    getLanguage,
    initializeTranslations,
};
