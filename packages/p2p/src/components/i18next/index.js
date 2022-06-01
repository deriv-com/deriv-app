/* eslint-disable */
import { str as crc32 } from 'crc-32';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import withI18n from './component.jsx';
// TODO: [fix-p2p-translation] add in context translation
import ar from 'Translations/ar.json';
import de from 'Translations/de.json';
import es from 'Translations/es.json';
import en from 'Translations/en.json';
import fa from 'Translations/fa.json';
import fr from 'Translations/fr.json';
import id from 'Translations/id.json';
import it from 'Translations/it.json';
import ko from 'Translations/ko.json';
import ms from 'Translations/ms.json';
import pl from 'Translations/pl.json';
import ru from 'Translations/ru.json';
import ta from 'Translations/ta.json';
import zh from 'Translations/zh.json';

const DEFAULT_LANGUAGE = 'EN';
let CURRENT_LANGUAGE = 'EN';

export const setLanguage = lang => {
    CURRENT_LANGUAGE = lang || DEFAULT_LANGUAGE;
    i18n.changeLanguage(lang);
};

const getLanguage = () => CURRENT_LANGUAGE;

const initial_language = getLanguage();

const i18n_config = {
    resources: {
        AR: { translations: { ...ar } },
        DE: { translations: { ...de } },
        EN: { translations: { ...en } },
        ES: { translations: { ...es } },
        FA: { translations: { ...fa } },
        FR: { translations: { ...fr } },
        ID: { translations: { ...id } },
        IT: { translations: { ...it } },
        KO: { translations: { ...ko } },
        MS: { translations: { ...ms } },
        PL: { translations: { ...pl } },
        RU: { translations: { ...ru } },
        TA: { translations: { ...ta } },
        ZH: { translations: { ...zh } },
    },
    react: {
        hashTransKey(defaultValue) {
            return crc32(defaultValue);
        },
    },
    lng: initial_language,
    fallbackLng: 'EN',
    ns: ['translations'],
    defaultNS: 'translations',
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init(i18n_config);

// <Localize /> component wrapped with i18n
export const Localize = withI18n(i18n);

export const localize = (string, values) => {
    if (!string) return '';
    return i18n.t(crc32(string), { defaultValue: string, ...values });
};

export default i18n;
