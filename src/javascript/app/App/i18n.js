import { str as crc32 }     from 'crc-32';
import i18n                 from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as messages        from '../../../translations/messages.json';

const i18n_config = {
    resources: {
        EN: {
            translation: {
                ...messages,
            },
        },
    },
    react: {
        hashTransKey(defaultValue) {
            return crc32(defaultValue);
        },
    },
    lng: window.location.search ?
        window.location.search.includes('lang=') ?
            window.location.search
                .substr(1).split('&')
                .find(query => query.includes('lang='))
                .split('=')[1]
                .toUpperCase()
            : undefined
        : undefined,
    fallbackLng: 'EN',
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init(i18n_config);

export const localize = (string, values) => i18n.t(crc32(string), { defaultValue: string, ...values });

export default i18n;
