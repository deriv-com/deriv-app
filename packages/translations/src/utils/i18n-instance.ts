import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { str as crc32 } from 'crc-32';
import ach from '../translations/ach.json';
import ar from '../translations/ar.json';
import bn from '../translations/bn.json';
import de from '../translations/de.json';
import es from '../translations/es.json';
import fr from '../translations/fr.json';
import id from '../translations/id.json';
import it from '../translations/it.json';
import ko from '../translations/ko.json';
import pl from '../translations/pl.json';
import pt from '../translations/pt.json';
import ru from '../translations/ru.json';
import si from '../translations/si.json';
import th from '../translations/th.json';
import tr from '../translations/tr.json';
import vi from '../translations/vi.json';
import zh_cn from '../translations/zh_cn.json';
import zh_tw from '../translations/zh_tw.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ACH: { translations: { ...ach } },
            AR: { translations: { ...ar } },
            BN: { translations: { ...bn } },
            DE: { translations: { ...de } },
            ES: { translations: { ...es } },
            FR: { translations: { ...fr } },
            ID: { translations: { ...id } },
            IT: { translations: { ...it } },
            KO: { translations: { ...ko } },
            PL: { translations: { ...pl } },
            PT: { translations: { ...pt } },
            RU: { translations: { ...ru } },
            SI: { translations: { ...si } },
            TH: { translations: { ...th } },
            TR: { translations: { ...tr } },
            VI: { translations: { ...vi } },
            ZH_CN: { translations: { ...zh_cn } },
            ZH_TW: { translations: { ...zh_tw } },
        },
        fallbackLng: 'EN',
        ns: ['translations'],
        defaultNS: 'translations',
        react: {
            hashTransKey(defaultValue: string) {
                return crc32(defaultValue);
            },
        },
    });

export default i18n;
