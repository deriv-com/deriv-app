import { expect }   from 'chai';
import getBaseName  from '../base-name';
import Url          from '../../../../_common/url';
import { setURL }   from '../../../../_common/__tests__/tests_common';

describe('base_name.getBaseName', () => {
    it('expect return correct value when pathname is not set', () => {
        expect(getBaseName()).to.eq('/app/en/');
    });
    it('expect return correct value when pathname is set', () => {
        setURL(`${Url.websiteUrl()}app/de/home.html`);
        expect(getBaseName()).to.eq('/app/de');
    });
    after(() => {
        setURL(`${Url.websiteUrl()}en/home.html`);
    });
});
