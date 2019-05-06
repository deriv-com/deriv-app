const statement                    = require('../statement/statement');
const { api, expect, getApiToken } = require('../../../../../_common/__tests__/tests_common');

describe('Statement', () => {
    let statement_ws;
    before(function (done) {
        this.timeout(10000);
        // this is a read token, even if other people take it, won't be able to do any harm
        api.authorize(getApiToken()).then(() => {
            api.getStatement({ limit: 1, description: 1, offset: 0 }).then((response) => {
                statement_ws = response.statement;
                done();
            });
        });
    });
    it('Should have all expected data', () => {
        const statement_data = statement.getStatementData(statement_ws.transactions[0]);
        expect(statement_data).to.be.an('Object')
            .and.to.have.property('date')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('ref')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('payout')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('localized_action')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('action_type')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('amount')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('balance')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('desc')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('id')
            .and.to.be.a('string');
    });
});
