const { expect, setURL } = require('./tests_common');
const Language           = require('../language');
const Url                = require('../url');

describe('Language', () => {
    const all_languages = {
        ACH  : 'Translations',
        EN   : 'English',
        DE   : 'Deutsch',
        ES   : 'Español',
        FR   : 'Français',
        ID   : 'Indonesia',
        IT   : 'Italiano',
        PL   : 'Polish',
        PT   : 'Português',
        RU   : 'Русский',
        TH   : 'Thai',
        VI   : 'Tiếng Việt',
        ZH_CN: '简体中文',
        ZH_TW: '繁體中文',
    };
    const website_url = Url.websiteUrl();

    describe('.getAll()', () => {
        it('works as expected', () => {
            expect(Language.getAll()).to.deep.eq(all_languages);
        });
    });

    describe('.get()', () => {
        it('defaults to EN', () => {
            expect(Language.get()).to.eq('EN');
        });
        it('can detect language from url', () => {
            setURL(`${website_url}es/home.html`);
            expect(Language.get()).to.eq('ES');
        });
        it('reverts to default language (EN) if invalid url language', () => {
            setURL(`${website_url}zz/home.html`);
            expect(Language.get()).to.eq('EN');
            setURL(`${website_url}en/home.html`);
        });
    });

    describe('.urlFor()', () => {
        it('works as expected for current url', () => {
            expect(Language.urlFor('ZH_TW')).to.eq(`${website_url}zh_tw/home.html`);
        });
        it('works as expected for custom url', () => {
            expect(Language.urlFor('ZH_CN', `${website_url}en/tour.html`)).to.eq(`${website_url}zh_cn/tour.html`);
        });
        it('reverts to default (EN) if passed empty language', () => {
            expect(Language.urlFor('', `${website_url}en/tour.html`)).to.eq(`${website_url}en/tour.html`);
        });
    });

    describe('.urlLang()', () => {
        it('works as expected for current url', () => {
            setURL(`${website_url}id/home.html`);
            expect(Language.urlLang()).to.eq('id');
        });
        it('works as expected for custom url', () => {
            expect(Language.urlLang(`${website_url}vi/tour.html`)).to.eq('vi');
        });
        it('works as expected for invalid language in custom url', () => {
            expect(Language.urlLang(`${website_url}zz/tour.html`)).to.eq('');
        });
    });
});
