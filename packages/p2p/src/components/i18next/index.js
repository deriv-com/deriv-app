/* eslint-disable */
import { str as crc32 }     from 'crc-32';
import i18n                 from 'i18next';
import { initReactI18next } from 'react-i18next';
import withI18n             from './component.jsx'
// TODO: [fix-p2p-translation] add in context translation
import ach                  from '../../translations/ach.json';
import en                   from '../../translations/en.json';
import es                   from '../../translations/es.json';
import fr                   from '../../translations/fr.json';
import id                   from '../../translations/id.json';
import it                   from '../../translations/it.json';
import pl                   from '../../translations/pl.json';
import pt                   from '../../translations/pt.json';
import ru                   from '../../translations/ru.json';
import vi                   from '../../translations/ru.json';
import zh_cn                from '../../translations/zh_cn.json';
import zh_tw                from '../../translations/zh_tw.json';

const DEFAULT_LANGUAGE = 'EN';
let CURRENT_LANGUAGE = 'EN';

export const setLanguage = (lang) => {
    CURRENT_LANGUAGE = lang || DEFAULT_LANGUAGE;
};

const getLanguage = () => CURRENT_LANGUAGE;

const initial_language = getLanguage();

const i18n_config = {
    resources: {
        ACH  : { translations: {...ach } },
        EN   : { translations: { ...en } },
        ES   : { translations: { ...es } },
        FR   : { translations: { ...fr } },
        ID   : { translations: { ...id } },
        IT   : { translations: { ...it } },
        PL   : { translations: { ...pl } },
        PT   : { translations: { ...pt } },
        RU   : { translations: { ...ru } },
        VI   : { translations: { ...vi } },
        ZH_CN: { translations: { ...zh_cn } },
        ZH_TW: { translations: { ...zh_tw } },
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

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init(i18n_config);

// <Localize /> component wrapped with i18n
export const Localize = withI18n(i18n);

export const localize = (string, values) => {
    if (!string) return '';
    return i18n.t(crc32(string), { defaultValue: string, ...values })
};

export default i18n;
