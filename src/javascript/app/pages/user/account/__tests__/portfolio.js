const portfolio                    = require('../portfolio/portfolio').Portfolio;
const { api, expect, getApiToken } = require('../../../../../_common/__tests__/tests_common');

const portfolio_mock_data = {
    symbol        : 'frxAUDJPY',
    shortcode     : 'CALL_FRXAUDJPY_10_1467352741_1467388741_S0P_0',
    contract_id   : '9299986648',
    longcode      : 'Win payout if AUD/JPY is strictly higher than entry spot at 10 hours after contract start time.',
    expiry_time   : 1467388741,
    currency      : 'USD',
    transaction_id: '18513214188',
    date_start    : 1467352741,
    buy_price     : '5.37',
    purchase_time : 1467352741,
    contract_type : 'CALL',
    payout        : '10',
};
const proposal_open_contract_mock_data = { barrier: '77.005', date_settlement: 1467601890, contract_id: '9324792108', underlying: 'frxAUDJPY', currency: 'USD', validation_error: 'Resale of this contract is not offered.', entry_tick: '77.005', current_spot: '77.011', date_start: 1467601830, id: 'E1B3A778-4194-11E6-BAA6-94FA35FED3E5', purchase_time: 1467601830, transaction_ids: { buy: '18562880908' }, barrier_count: 1, contract_type: 'CALL', is_intraday: 1, is_settleable: 0, is_valid_to_sell: 0, shortcode: 'CALL_FRXAUDJPY_10_1467601830_1467601890_S0P_0', bid_price: '5.16', is_forward_starting: 0, longcode: 'Win payout if AUD/JPY is strictly higher than entry spot at 1 minute after contract start time.', is_sold: 0, display_name: 'AUD/JPY', is_path_dependent: 0, date_expiry: 1467601890, entry_tick_time: 1467601831, entry_spot: '77.005', buy_price: '5.06', current_spot_time: '1467601837', payout: '10' };
const values_mock_data                 = { 9324828148: { indicative: '4.33', buy_price: '5.37' }, 9299986648: { indicative: '5.16', buy_price: '5.14' } };

describe('Portfolio', () => {
    let balance;
    before(function (done) {
        this.timeout(10000);
        // this is a read token, even if other people take it, won't be able to do any harm
        api.authorize(getApiToken()).then(() => {
            api.subscribeToBalance().then((response) => {
                balance = response;
                done();
            });
        });
    });
    it('Should have all functions that are being tested', () => {
        expect(portfolio).to.have.any.keys('getBalance', 'getPortfolioData', 'getProposalOpenContract', 'getIndicativeSum', 'getSumPurchase');
    });
    it('Should have balance', () => {
        const balance_string = portfolio.getBalance(balance, 'USD');
        expect(balance_string).to.be.a('string');
        const balance_value = portfolio.getBalance(balance);
        expect(balance_value).to.be.a('number');
    });
    it('Should have all expected data for portfolio', () => {
        const portfolio_data = portfolio.getPortfolioData(portfolio_mock_data);
        expect(portfolio_data).to.be.an('Object')
            .and.to.have.property('transaction_id')
            .and.to.be.a('string');
        expect(portfolio_data).to.have.property('contract_id')
            .and.to.be.a('string');
        expect(portfolio_data).to.have.property('payout')
            .and.to.be.a('number');
        expect(portfolio_data).to.have.property('longcode')
            .and.to.be.a('string');
        expect(portfolio_data).to.have.property('currency')
            .and.to.be.a('string');
        expect(portfolio_data).to.have.property('buy_price')
            .and.to.be.a('string');
    });
    it('Should have all expected data for proposal open contract', () => {
        const proposal_open_contract_data = portfolio.getProposalOpenContract(proposal_open_contract_mock_data);
        expect(proposal_open_contract_data).to.be.an('Object')
            .and.to.have.property('contract_id')
            .and.to.be.a('string');
        expect(proposal_open_contract_data).to.have.property('bid_price')
            .and.to.be.a('number');
        expect(proposal_open_contract_data).to.have.property('is_sold')
            .and.to.be.a('number');
        expect(proposal_open_contract_data).to.have.property('is_valid_to_sell')
            .and.to.be.a('number');
        expect(proposal_open_contract_data).to.have.property('currency')
            .and.to.be.a('string');
    });
    it('Should calculate the correct indicative sum', () => {
        const indicative_sum_data = portfolio.getIndicativeSum(values_mock_data);
        const calculated_sum      =
              parseFloat(values_mock_data[9324828148].indicative) + parseFloat(values_mock_data[9299986648].indicative);
        expect(indicative_sum_data).to.be.a('number')
            .and.to.eql(calculated_sum);
    });
    it('Should calculate the correct sum purchase', () => {
        const sum_purchase_data = portfolio.getSumPurchase(values_mock_data);
        const calculated_sum    =
              parseFloat(values_mock_data[9324828148].buy_price) + parseFloat(values_mock_data[9299986648].buy_price);
        expect(sum_purchase_data).to.be.a('number')
            .and.to.eql(calculated_sum);
    });
});
