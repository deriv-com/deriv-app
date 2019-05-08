const asset_index     = require('../asset_index/asset_index');
const { api, expect } = require('../../../../_common/__tests__/tests_common');

describe('Asset Index', () => {
    let asset_index_res,
        active_symbols_res;
    before(function (done) {
        this.timeout(10000);
        api.getAssetIndex().then((response) => {
            asset_index_res = response.asset_index;
            if (active_symbols_res) done();
        });
        api.getActiveSymbolsBrief().then((response) => {
            active_symbols_res = response.active_symbols;
            if (asset_index_res) done();
        });
    });

    it('Should have all functions that are being tested', () => {
        expect(asset_index).to.have.all.of.keys(['getAssetIndexData', 'getMarketColumns']);
    });

    it('Should getAssetIndexData() have all expected data', () => {
        const asset_index_data = asset_index.getAssetIndexData(asset_index_res, active_symbols_res);
        expect(asset_index_data).to.be.an('array');
        asset_index_data.forEach((asset_index_item) => {
            expect(asset_index_item).to.be.an('array')
                .to.have.lengthOf(5);
            expect(asset_index_item[0]).to.be.a('string');
            expect(asset_index_item[1]).to.be.a('string');
            expect(asset_index_item[2]).to.be.an('array');
            expect(asset_index_item[3]).to.be.an('object')
                .and.to.have.property('market')
                .that.is.a('string');
            expect(asset_index_item[3])
                .and.to.have.property('submarket')
                .that.is.a('string');
            expect(asset_index_item[3]).to.have.property('submarket')
                .that.is.a('string');
            expect(asset_index_item[4]).to.be.an('object');
        });
    });

    it('Should getMarketColumns() have all expected data', () => {
        const market_columns = asset_index.getMarketColumns();
        expect(market_columns).to.be.an('Object');
        Object.keys(market_columns).forEach((market) => {
            expect(market_columns[market]).to.have.property('columns')
                .that.is.an('array');
            expect(market_columns[market].columns.length).to.equal(market_columns[market].header.length);
        });
    });
});
