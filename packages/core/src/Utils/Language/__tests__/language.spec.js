import { expect }              from 'chai';
import React                   from 'react';
import { getAllowedLanguages } from '../language';

describe('getAllowedLanguages', () => {
    it('It Returns the desired allowed languages', () => {
        expect(getAllowedLanguages()).to.eql({
            // TODO uncomment this part when the design is ready.
            EN   : 'English',
            // DE   : 'Deutsch',
            // ES   : 'Español',
            // FR   : 'Français',
            // ID   : 'Indonesia',
            // IT   : 'Italiano',
            // PL   : 'Polish',
            // PT   : 'Português',
            // RU   : 'Русский',
            // TH   : 'Thai',
            // VI   : 'Tiếng Việt',
            // ZH_CN: '简体中文',
            // ZH_TW: '繁體中文',
        });
    });
});
