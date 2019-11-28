const { expect }         = require('./tests_common');
const Language           = require('../language');
const Url                = require('../url');

describe('Language', () => {
    const website_url = Url.websiteUrl();
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
});
