import { expect }   from 'chai';
import { setURL }   from '../../../../_common/__tests__/tests_common';
import Url          from '../../../../_common/url';
import URLHelper    from '../url-helper';

describe('URLHelper', () => {
    const url = 'https://binary.com/en/home.html?duration=13&market=forex';

    describe('.getQueryParams', () => {
        const params = URLHelper.getQueryParams(url);

        it('should return query parameters', () => {
            expect(params.get('duration')).to.eql('13');
            expect(params.get('market')).to.eql('forex');
        });
        it('should return an object', () => {
            expect(typeof params).to.eql('object');
        });
    });

    describe('.setQueryParam', () => {
        const params = {
            'currency': 'JPY',
            'market': 'forex',
        };

        it('should return an object', () => {
            expect(URLHelper.setQueryParam(params, url)).to.be.a('object');
        });
        it('should return an object currency key with the value of params.currency ', () => {
            expect(URLHelper.setQueryParam(params, url).searchParams.get('currency')).to.eql(params.currency);
        });
        it('should return an object market key with the value of params.market', () => {
            expect(URLHelper.setQueryParam(params, url).searchParams.get('market')).to.eql(params.market);
        });

    });

    describe('.getQueryString', () => {
        it('should return a correct query string', () => {
            const query = '?duration=13&market=forex';
            expect(URLHelper.getQueryString(url)).to.eql(query);
        })
    });
});
