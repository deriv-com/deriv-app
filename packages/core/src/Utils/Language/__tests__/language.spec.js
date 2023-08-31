import { getAllowedLanguages } from '@deriv/translations';

const languages = {
    EN: 'English',
    ES: 'Español',
    FR: 'Français',
    ID: 'Indonesian',
    IT: 'Italiano',
    PL: 'Polish',
    RU: 'Русский',
    VI: 'Tiếng Việt',
    ZH_CN: '简体中文',
    ZH_TW: '繁體中文',
    TH: 'ไทย',
};

describe('getAllowedLanguages method', () => {
    it('should return the desired allowed languages', () => {
        expect(getAllowedLanguages()).toEqual(languages);
    });
});
