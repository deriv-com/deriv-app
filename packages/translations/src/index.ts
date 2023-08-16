import { Localize } from './components';
import { TranslationDataContext, TranslationProvider, useTranslationContext } from './context/translation-provider';
import { useLanguageChecks, useLanguageSettings } from './hooks';
import { localize } from './utils/localize';
import { getLanguage } from './utils/i18next';
import type { Language, LanguageKey } from './utils/config';

export {
    getLanguage,
    Localize,
    localize,
    TranslationDataContext,
    TranslationProvider,
    useLanguageChecks,
    useLanguageSettings,
    useTranslationContext,
};
export type { Language, LanguageKey };
