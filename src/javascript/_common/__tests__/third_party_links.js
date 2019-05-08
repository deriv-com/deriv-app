const { expect, setURL } = require('./tests_common');
const AccountOpening     = require('../third_party_links');

describe('ThirdPartyLinks', () => {
    [
        'https://www.binary.com',
        'https://www.binary.me',
        'https://www.deriv.com',
    ].forEach(url => {
        describe(url, () => {
            runTests(url);
        });
    });
});

function runTests(url) {
    describe('.isThirdPartyLink()', () => {
        let domain;
        before(() => {
            setURL(url);
            domain = url.replace(/^https:\/\/www\./, '');
        });

        it(`works for ${domain}`, () => {
            expect(AccountOpening.isThirdPartyLink(url)).to.equal(false);
        });
        it(`works for ${domain} subdomains`, () => {
            expect(AccountOpening.isThirdPartyLink(`https://www.style.${domain}`)).to.equal(false);
            expect(AccountOpening.isThirdPartyLink(`https://login.${domain}/signup.php?lang=0`)).to.equal(false);
        });
        it('works for special values', () => {
            expect(AccountOpening.isThirdPartyLink('javascript:;')).to.equal(false);
            expect(AccountOpening.isThirdPartyLink('#')).to.equal(false);
            expect(AccountOpening.isThirdPartyLink(`mailto:affiliates@${domain}`)).to.equal(false);
        });
        it('works for third party domains', () => {
            expect(AccountOpening.isThirdPartyLink('https://www.authorisation.mga.org.mt/verification.aspx?lang=EN&company=a5fd1edc-d072-4c26-b0cd-ab3fa0f0cc40&details=1')).to.equal(true);
            expect(AccountOpening.isThirdPartyLink('https://twitter.com/Binarydotcom')).to.equal(true);
        });
    });
}
