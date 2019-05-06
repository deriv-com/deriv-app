const profitTable                  = require('../profit_table/profit_table');
const { api, expect, getApiToken } = require('../../../../../_common/__tests__/tests_common');

describe('Profit Table', () => {
    let profit_table;
    before(function (done) {
        this.timeout(10000);
        // this is a read token, even if other people take it, won't be able to do any harm
        api.authorize(getApiToken()).then(() => {
            api.getProfitTable({ limit: 1, description: 1, offset: 0 }).then((response) => {
                profit_table = response.profit_table;
                done();
            });
        });
    });
    it('Should have all expected data', () => {
        const profit_table_data = profitTable.getProfitTabletData(profit_table.transactions[0]);
        expect(profit_table_data).to.be.an('Object')
            .and.to.have.property('buyDate')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('ref')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('payout')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('buyPrice')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('sellDate')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('sellPrice')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('pl')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('desc')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('id')
            .and.to.be.a('string');
    });
});
