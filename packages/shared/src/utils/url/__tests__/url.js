import { deriv_urls } from '../constants';
import { reset, urlFor, websiteUrl, getPath, getContractPath } from '../url';
import { expect } from '../../../test_utils/test_common';

// Testable URLs
const urls = [deriv_urls.DERIV_APP_PRODUCTION];

function mockLocation(url) {
    // Mocking global location
    delete global.window.location;
    global.window = Object.create(window);
    window.location = new URL(url);
    reset();
}

describe('Url', () => {
    urls.forEach(url => {
        describe(url, () => {
            let home_url, website_url, query_string, params_obj, url_no_qs, url_with_qs;
            beforeAll(() => {
                mockLocation(url);

                /**
                 * Pre-defined values
                 */
                website_url = websiteUrl();
                home_url = `${website_url}home.html`;
                query_string = 'market=forex&duration_amount=5&no_value=';
                params_obj = { market: 'forex', duration_amount: '5', no_value: '' };
                url_no_qs = `${website_url}trading.html`;
                url_with_qs = `${url_no_qs}?${query_string}`;
            });
            it('assert mocking globals is working', () => {
                const fqdn = url.replace('https://', '');
                expect(window.location.hostname).to.be.eq(fqdn);
                expect(location.hostname).to.be.eq(fqdn);
                expect(window.location.href).to.be.eq(websiteUrl());
            });
            describe('.urlFor()', () => {
                it('returns home as default', () => {
                    ['', '/', 'home'].forEach(path => {
                        expect(urlFor(path)).to.eq(home_url);
                    });
                });
                it('accepts params', () => {
                    expect(
                        urlFor('trading', {
                            query_string,
                        })
                    ).to.eq(url_with_qs);
                });
                it('returns the correct language', () => {
                    expect(urlFor('home', { language: 'es' })).to.eq(`${website_url}home.html?lang=es`);
                });
                it('ignores invalid characters', () => {
                    expect(urlFor('`~!@$%^&*=+[}{]\\"\';:?><,|')).to.eq(home_url);
                });
                it('handles all valid characters', () => {
                    expect(urlFor('metatrader/comparison-4_vs_5')).to.eq(
                        `${website_url}metatrader/comparison-4_vs_5.html`
                    );
                });
            });

            describe('.websiteUrl()', () => {
                it('returns expected value', () => {
                    expect(website_url).to.eq(`${url}/`);
                });
            });

            describe('getPath', () => {
                it('should return param values in params as a part of path', () => {
                    expect(getPath('/contract/:contract_id', { contract_id: 37511105068 })).to.equal(
                        '/contract/37511105068'
                    );
                    expect(
                        getPath('/something_made_up/:something_made_up_param1/:something_made_up_param2', {
                            something_made_up_param1: '789',
                            something_made_up_param2: '123456',
                        })
                    ).to.equal('/something_made_up/789/123456');
                });
                it('should return path as before if there is no params', () => {
                    expect(getPath('/contract')).to.equal('/contract');
                });
            });

            describe('getContractPath', () => {
                it('should return the path of contract with contract_id passed', () => {
                    expect(getContractPath(1234)).to.equal('/contract/1234');
                });
            });
        });
    });
});
