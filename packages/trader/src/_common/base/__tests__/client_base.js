const CurrencyUtils           = require('deriv-shared/utils/currency');
const Client                  = require('../client_base');
const { api, expect, setURL } = require('../../__tests__/tests_common');
const State                   = require('../../storage').State;
const Url                     = require('../../url');

describe('ClientBase', () => {
    const loginid_invalid   = 'ZZ123456789';
    const loginid_virtual   = 'VRTC123456789';
    const loginid_real      = 'CR123456789';
    const loginid_real_2    = 'CR123456788';
    const loginid_real_iom  = 'MX123';
    const loginid_gaming    = 'MLT123';
    const loginid_financial = 'MF123';

    const landing_company  = { landing_company: { financial_company: { name: 'Binary Investments (Europe) Ltd', shortcode: 'maltainvest' }, gaming_company: { name: 'Binary (Europe) Ltd', shortcode: 'malta' } }, msg_type: 'landing_company' };
    const authorize        = { authorize: { upgradeable_landing_companies: [] }};
    const account_settings = { client_tnc_status: 1 };

    describe('.validateLoginid()', () => {
        it('can detect a valid loginid', () => {
            [loginid_virtual, loginid_real].forEach((id) => {
                Client.set('loginid', id, id);
                Client.set('token', 'test', id);
                expect(Client.isValidLoginid()).to.eq(true);
            });
        });
        it('can detect an invalid loginid', () => {
            Client.set('loginid', loginid_invalid, loginid_invalid);
            Client.set('token', 'test', loginid_invalid);
            expect(Client.isValidLoginid()).to.eq(false);
        });
        after(() => {
            Client.clearAllAccounts();
        });
    });

    describe('.(set|get)()', () => {
        it('sets and gets for expected client', () => {
            Client.set('currency', 'USD', loginid_virtual);
            Client.set('currency', 'EUR', loginid_real);
            expect(Client.get('currency', loginid_virtual)).to.eq('USD');
            expect(Client.get('currency', loginid_real)).to.eq('EUR');
        });
        it('returns expected data types', () => {
            Client.set('number', 1, loginid_real);
            expect(Client.get('number', loginid_real)).to.be.a('Number').and.to.eq(1);
            Client.set('float', 1.12345, loginid_real);
            expect(Client.get('float', loginid_real)).to.be.a('Number').and.to.eq(1.12345);
            const obj_nested = { a: { b: 'test' } };
            Client.set('object', obj_nested, loginid_real);
            expect(Client.get('object', loginid_real)).to.be.an('Object').and.to.deep.eq(obj_nested);
            Client.set('bool', true, loginid_real);
            expect(Client.get('bool', loginid_real)).to.be.a('boolean').and.to.eq(true);
            Client.set('undef', undefined, loginid_real);
            expect(Client.get('undef', loginid_real)).to.eq(undefined);
        });
    });

    describe('.getAllLoginids()', () => {
        it('works as expected', () => {
            expect(Client.getAllLoginids()).to.deep.eq([ loginid_virtual, loginid_real ]);
        });
    });

    describe('.getAccountType()', () => {
        it('works as expected', () => {
            expect(Client.getAccountType(loginid_virtual)).to.eq('virtual');
            expect(Client.getAccountType(loginid_real)).to.eq(undefined);
            expect(Client.getAccountType(loginid_gaming)).to.eq('gaming');
            expect(Client.getAccountType(loginid_financial)).to.eq('financial');
        });
    });

    describe('.isAccountOfType()', () => {
        it('works as expected', () => {
            expect(Client.isAccountOfType('virtual', loginid_virtual)).to.eq(true);
            expect(Client.isAccountOfType('real', loginid_real)).to.eq(true);
        });
        it('doesn\'t return disabled account if enabled_only flag is set', () => {
            Client.set('is_disabled', 1, loginid_financial);
            expect(Client.isAccountOfType('financial', loginid_financial, 1)).to.eq(false);
        });
    });

    describe('.getAccountOfType()', () => {
        it('works as expected', () => {
            expect(Client.getAccountOfType('virtual').loginid).to.eq(loginid_virtual);
            expect(Client.getAccountOfType('real').loginid).to.eq(loginid_real);
            expect(Client.getAccountOfType('financial').loginid).to.eq(loginid_financial);
        });
        it('doesn\'t return disabled account if enabled_only flag is set', () => {
            expect(Client.getAccountOfType('financial', 1).loginid).to.eq(undefined);
        });
    });

    describe('.hasAccountType()', () => {
        it('works as expected', () => {
            expect(Client.hasAccountType('financial')).to.eq(true);
        });
        it('doesn\'t return disabled account if enabled_only flag is set', () => {
            expect(Client.hasAccountType('financial', 1)).to.eq(false);
        });
    });

    describe('.hasCurrencyType()', () => {
        it('works as expected', () => {
            Client.set('is_virtual', 1, loginid_virtual);
            expect(Client.hasCurrencyType('fiat')).to.eq(loginid_real);
            expect(Client.hasCurrencyType('crypto')).to.eq(undefined);
        });
    });

    describe('.shouldAcceptTnc()', () => {
        it('doesn\'t ask to accept if same version', () => {
            State.set(['response', 'website_status', 'website_status', 'terms_conditions_version'], 1);
            expect(Client.shouldAcceptTnc(account_settings)).to.eq(false);
        });
        it('asks to accept if different version', () => {
            State.set(['response', 'website_status', 'website_status', 'terms_conditions_version'], 2);
            expect(Client.shouldAcceptTnc(account_settings)).to.eq(true);
        });
    });

    describe('.clearAllAccounts()', () => {
        it('works as expected', () => {
            Client.clearAllAccounts();
            expect(Client.get()).to.deep.eq({});
        });
    });

    describe('.currentLandingCompany()', () => {
        it('works as expected', () => {
            State.set(['response', 'landing_company'], landing_company);
            Client.set('landing_company_shortcode', 'malta');
            expect(Client.currentLandingCompany()).to.deep.eq({ name: 'Binary (Europe) Ltd', shortcode: 'malta' });
            Client.set('landing_company_shortcode', 'maltainvest');
            expect(Client.currentLandingCompany()).to.deep.eq({ name: 'Binary Investments (Europe) Ltd', shortcode: 'maltainvest' });
            Client.set('landing_company_shortcode', 'virtual');
            expect(Client.currentLandingCompany()).to.deep.eq({});
        });
    });

    describe('.getBasicUpgradeInfo()', () => {
        it('returns false if client can\'t upgrade', () => {
            State.set(['response', 'authorize'], authorize);
            expect(Client.getBasicUpgradeInfo().can_upgrade).to.eq(false);
        });
        it('returns as expected for accounts that can upgrade to real', () => {
            ['svg', 'malta', 'iom'].forEach((lc) => {
                State.set(['response', 'authorize', 'authorize', 'upgradeable_landing_companies'], [ lc ]);
                const ugprade_info = Client.getBasicUpgradeInfo();
                expect(ugprade_info.can_upgrade).to.eq(true);
                expect(ugprade_info.can_upgrade_to).to.eq(lc);
                expect(ugprade_info.type).to.eq('real');
                expect(ugprade_info.can_open_multi).to.eq(false);
            });
        });
        it('returns as expected for accounts that can upgrade to financial', () => {
            State.set(['response', 'authorize', 'authorize', 'upgradeable_landing_companies'], [ 'maltainvest' ]);
            const ugprade_info = Client.getBasicUpgradeInfo();
            expect(ugprade_info.can_upgrade).to.eq(true);
            expect(ugprade_info.can_upgrade_to).to.eq('maltainvest');
            expect(ugprade_info.type).to.eq('financial');
            expect(ugprade_info.can_open_multi).to.eq(false);
        });
        it('returns as expected for multi account opening', () => {
            State.set(['response', 'authorize', 'authorize', 'upgradeable_landing_companies'], [ 'svg' ]);
            Client.set('landing_company_shortcode', 'svg');
            const ugprade_info = Client.getBasicUpgradeInfo();
            expect(ugprade_info.can_upgrade).to.eq(false);
            expect(ugprade_info.can_upgrade_to).to.eq(undefined);
            expect(ugprade_info.type).to.eq(undefined);
            expect(ugprade_info.can_open_multi).to.eq(true);
        });
    });

    describe('.getLandingCompanyValue()', () => {
        it('works as expected', () => {
            expect(Client.getLandingCompanyValue(loginid_financial, landing_company.landing_company, 'name')).to.eq(landing_company.landing_company.financial_company.name);
            expect(Client.getLandingCompanyValue(loginid_gaming, landing_company.landing_company, 'name')).to.eq(landing_company.landing_company.gaming_company.name);
        });
    });

    describe('.canTransferFunds()', () => {
        before(function (done) {
            this.timeout(5000);
            api.getWebsiteStatus().then((response) => {
                CurrencyUtils.setCurrencies(response.website_status);
                done();
            });
        });
        it('fails if client has maltainvest and malta accounts with one missing currency', () => {
            Client.clearAllAccounts();
            [loginid_gaming, loginid_financial].forEach((id) => {
                Client.set('loginid', id, id);
            });
            Client.set('landing_company_shortcode', 'maltainvest', loginid_financial);
            Client.set('landing_company_shortcode', 'malta', loginid_gaming);

            Client.set('currency', 'USD', loginid_gaming);

            expect(Client.canTransferFunds()).to.eq(false);
        });
        it('fails if client has maltainvest and malta accounts with differing currencies', () => {
            Client.set('currency', 'USD', loginid_gaming);
            Client.set('currency', 'EUR', loginid_financial);

            expect(Client.canTransferFunds()).to.eq(false);
        });
        it('passes if client has maltainvest and malta accounts with the same currency', () => {
            Client.set('currency', 'USD', loginid_gaming);
            Client.set('currency', 'USD', loginid_financial);

            expect(Client.canTransferFunds()).to.eq(true);
        });
        it('fails if maltainvest and non-malta client even if same currency', () => {
            Client.clearAllAccounts();
            [loginid_real_iom, loginid_financial].forEach((id) => {
                Client.set('loginid', id, id);
            });
            Client.set('landing_company_shortcode', 'iom', loginid_real_iom);
            Client.set('landing_company_shortcode', 'maltainvest', loginid_financial);

            Client.set('currency', 'USD', loginid_real_iom);
            Client.set('currency', 'USD', loginid_financial);

            expect(Client.canTransferFunds()).to.eq(false);
        });
        it('fails if non-maltainvest client only has fiat accounts', () => {
            Client.clearAllAccounts();
            [loginid_real, loginid_real_2].forEach((id) => {
                Client.set('loginid', id, id);
            });
            Client.set('currency', 'USD', loginid_real);
            Client.set('currency', 'EUR', loginid_real_2);

            expect(Client.canTransferFunds()).to.eq(false);
        });
        it('fails if non-maltainvest client only has crypto accounts', () => {
            Client.set('currency', 'BTC', loginid_real);
            Client.set('currency', 'ETH', loginid_real_2);

            expect(Client.canTransferFunds()).to.eq(false);
        });
        it('passes if non-maltainvest client has fiat and crypto accounts', () => {
            Client.set('currency', 'USD', loginid_real);
            Client.set('currency', 'BTC', loginid_real_2);

            expect(Client.canTransferFunds()).to.eq(true);
        });
        after(() => {
            Client.clearAllAccounts();
        });
    });

    describe('.hasSvgAccount()', () => {
        it('works as expected', () => {
            Client.set('loginid', loginid_financial, loginid_financial);
            Client.set('token', 'test', loginid_financial);
            expect(Client.hasSvgAccount()).to.eq(false);
            Client.set('loginid', loginid_real, loginid_real);
            Client.set('token', 'test', loginid_real);
            expect(Client.hasSvgAccount()).to.eq(true);
        });
    });

    after(() => {
        setURL(`${Url.websiteUrl()}en/home.html`);
        Client.clearAllAccounts();
    });
});
