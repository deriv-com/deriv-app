import { getLanguage } from '@deriv/translations';
import { urlForLanguage } from '@deriv/shared/utils/url';

export const currentLanguage = getLanguage();

export const getURL = lang => urlForLanguage(lang);
