import { Localize } from './components';
import { TranslationProvider } from './context/translation-provider';
import { useLanguageChecks, useLanguageSettings } from './hooks';
import { localize } from './utils/localize';
import { getLanguage } from './utils/i18next';
import type { Language } from './utils/config';

export { getLanguage, Localize, localize, TranslationProvider, useLanguageChecks, useLanguageSettings };
export type { Language };
