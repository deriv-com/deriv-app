import { getLanguage } from '@deriv/translations';
import { urlFor } from '_common/language';

export const currentLanguage = getLanguage();

export const getURL = lang => urlFor(lang);
