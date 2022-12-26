import { formatPortfolioPosition } from '../format-response';

describe('formatPortfolioPosition', () => {
    const mock_active_symbols = [{ display_name: 'Volatility 25 Index', symbol: 'R_25' }];
    const portfolio_pos = {
        buy_price: 2500.5,
        contract_id: 1234,
        contract_type: 'ASIANU',
        longcode: 'test \n test \n test',
        payout: 3500.1,
        symbol: 'R_25',
        shortcode: 'ASIANU_R_25_',
        transaction_id: 5678,
    };

    it('should return an object with values in object passed as argument', () => {
        expect(formatPortfolioPosition(portfolio_pos, mock_active_symbols)).toEqual({
            details: 'test <br /> test <br /> test',
            display_name: 'Volatility 25 Index',
            id: 1234,
            indicative: 0,
            is_unsupported: true,
            payout: 3500.1,
            contract_update: undefined,
            purchase: 2500.5,
            reference: +5678,
            type: 'ASIANU',
            contract_info: portfolio_pos,
        });
    });
});
