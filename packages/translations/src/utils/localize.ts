import { str as crc32 } from 'crc-32';
import i18n from './i18n-instance';

/** @deprecated Use the <Localize /> component instead. This doesn't follow the react lifecycle */
export const localize = <T extends object>(string: string, values?: T) => {
    return i18n.t(crc32(string).toString(), { defaultValue: string, ...values });
};
