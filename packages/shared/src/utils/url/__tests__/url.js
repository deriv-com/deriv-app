import { expect, setURL } from '../../../test_utils/common';
import {
    reset,
    urlFor,
    websiteUrl,
    paramsHash,
    urlForCurrentDomain,
    getHostMap,
    param,
    urlForStatic,
    resetStaticHost,
} from '../url';

// Testable URLs
const urls = ['https://deriv.app'];

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

                /*
                 Pre defined values
                 */
                website_url = websiteUrl();
                home_url = `${website_url}home.html`;
                query_string = 'market=forex&duration_amount=5&no_value=';
                params_obj = { market: 'forex', duration_amount: '5', no_value: '' };
                url_no_qs = `${website_url}trading.html`;
                url_with_qs = `${url_no_qs}?${query_string}`;
            });
            it('assert mocking globals is working', () => {
                expect(window.location.hostname).to.be.eq('deriv.app');
                expect(location.hostname).to.be.eq('deriv.app');
                expect(window.location.href).to.be.eq(websiteUrl());
            });
            describe('.urlFor()', () => {
                it('returns home as default', () => {
                    [undefined, null, '', '/', 'home'].forEach(path => {
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
                    expect(urlFor('home', { language: 'es' })).to.eq(`${website_url}home.html`);
                });
                it('ignores invalid characters', () => {
                    expect(urlFor('`~!@#$%^&*)(=+[}{]\\"\';:?><,|')).to.eq(home_url);
                });
                it('handles all valid characters', () => {
                    expect(urlFor('metatrader/comparison-4_vs_5')).to.eq(
                        `${website_url}metatrader/comparison-4_vs_5.html`
                    );
                });
            });
            describe('.paramsHash()', () => {
                it('returns correct object', () => {
                    expect(paramsHash(url_with_qs))
                        .to.be.an('Object')
                        .and.to.have.all.keys('market', 'duration_amount', 'no_value')
                        .and.to.deep.equal(params_obj);
                });
                it('returns empty object when there is no query string', () => {
                    expect(paramsHash(url_no_qs))
                        .to.be.an('Object')
                        .and.to.deep.equal({});
                    expect(paramsHash(`${url_no_qs}?`))
                        .to.be.an('Object')
                        .and.to.deep.equal({});

                    expect(paramsHash()).to.deep.eq({});
                });
            });

            if (!/deriv.app/.test(url)) {
                describe('.urlForCurrentDomain()', () => {
                    const path_query_hash = 'path/to/file.html?q=value&n=1#hash';

                    it('updates domain correctly', () => {
                        expect(urlForCurrentDomain('https://www.deriv.app/')).to.eq(`${url}/`);
                        expect(urlForCurrentDomain(`https://www.deriv.app/${path_query_hash}`)).to.eq(
                            `${url}/${path_query_hash}`
                        );
                    });
                    it('updates host maps correctly', () => {
                        const host_map = getHostMap();
                        Object.keys(host_map).forEach(host => {
                            expect(urlForCurrentDomain(`https://${host}/`)).to.eq(`https://${host_map[host]}/`);
                            expect(urlForCurrentDomain(`https://${host}/${path_query_hash}`)).to.eq(
                                `https://${host_map[host]}/${path_query_hash}`
                            );
                        });
                    });
                    it("doesn't update email links", () => {
                        ['mailto:affiliates@binary.com', 'mailto:email@otherdomain.com'].forEach(email_link => {
                            expect(urlForCurrentDomain(email_link)).to.eq(email_link);
                        });
                    });
                    it("doesn't update the third party domains", () => {
                        expect(urlForCurrentDomain('https://www.otherdomain.com')).to.eq('https://www.otherdomain.com');
                        expect(urlForCurrentDomain('https://www.otherdomain.com/')).to.eq(
                            'https://www.otherdomain.com/'
                        );
                        expect(urlForCurrentDomain('https://subdomain.otherdomain.com/')).to.eq(
                            'https://subdomain.otherdomain.com/'
                        );
                        expect(urlForCurrentDomain('mailto:email@otherdomain.com')).to.eq(
                            'mailto:email@otherdomain.com'
                        );
                    });
                    it("doesn't update when current domain is not supported", () => {
                        setURL('https://user.github.io/');
                        [
                            'https://deriv.app',
                            'https://www.deriv.app/',
                            'https://bot.binary.com',
                            'mailto:affiliates@binary.com',
                        ].forEach(u => {
                            expect(urlForCurrentDomain(u)).to.eq(u);
                        });
                        setURL(url); // reset for the next test
                    });
                });
            }

            describe('.urlForStatic()', () => {
                beforeEach(() => {
                    resetStaticHost();
                });

                it('returns base path as default', () => {
                    expect(urlForStatic()).to.eq(website_url);
                });
                it('returns expected path', () => {
                    expect(urlForStatic('images/common/plus.svg')).to.eq(`${website_url}images/common/plus.svg`);
                });
            });

            describe('.param()', () => {
                beforeEach(() => {
                    mockLocation(url_with_qs);
                });
                it('returns undefined if no match', () => {
                    expect(param()).to.eq(undefined);
                });
                it('returns expected parameter', () => {
                    expect(param('duration_amount'))
                        .to.be.a('string')
                        .and.eq('5');
                    expect(param('no_value'))
                        .to.be.a('string')
                        .and.eq('');
                });
            });

            describe('.websiteUrl()', () => {
                it('returns expected value', () => {
                    expect(website_url).to.eq(`${url}/`);
                });
            });
        });
    });
});
