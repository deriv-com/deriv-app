import { formatProfitTableTransactions, TTransaction } from '../format-response';
import { ActiveSymbols } from '@deriv/api-types';

let mockProfitTableTransactionData: TTransaction;
describe('formatProfitTableTransactions', () => {
    beforeEach(() => {
        mockProfitTableTransactionData = {
            app_id: 11780,
            buy_price: 1,
            contract_id: 55113405821,
            contract_type: 'CALL',
            duration_type: 'minutes',
            longcode:
                'Win payout if Volatility 100 (1s) Index is strictly higher than entry spot at 15 minutes after contract start time.',
            payout: 1.96,
            purchase_time: 1700539661,
            sell_price: 0.61,
            sell_time: 1700539816,
            shortcode: 'CALL_1HZ100V_1.96_1700539661_1700540561_S0P_0',
            transaction_id: 111189668101,
            underlying_symbol: '1HZ100V',
        };
    });

    it('should return correct formatted object', () => {
        const currency = 'USD';
        const returnValue = formatProfitTableTransactions(mockProfitTableTransactionData, currency);
        expect(returnValue).toEqual({
            ...mockProfitTableTransactionData,
            display_name: '',
            purchase_time: '21 Nov 2023 04:07:41',
            purchase_time_unix: 1700539661,
            sell_time: '21 Nov 2023 04:10:16',
            profit_loss: '-0.39',
        });
    });

    it('should not return purchase time if purchase time is not available', () => {
        mockProfitTableTransactionData.purchase_time = undefined;
        const currency = 'USD';
        const returnValue = formatProfitTableTransactions(mockProfitTableTransactionData, currency);
        expect(returnValue.purchase_time).toBeUndefined();
    });

    it('should return profit loss for with correct BTC formatted value', () => {
        mockProfitTableTransactionData.buy_price = 0.0001;
        mockProfitTableTransactionData.sell_price = 0.0002;
        const currency = 'BTC';
        const returnValue = formatProfitTableTransactions(mockProfitTableTransactionData, currency);
        expect(returnValue.profit_loss).toEqual('0.00010000');
    });

    it('should return positive profit loss if sell price is more than buy price', () => {
        mockProfitTableTransactionData.sell_price = 1;
        mockProfitTableTransactionData.buy_price = 0.5;
        const currency = 'USD';
        const returnValue = formatProfitTableTransactions(mockProfitTableTransactionData, currency);
        expect(returnValue.profit_loss).toEqual('0.50');
    });

    it('should return display name if active symbols are available', () => {
        const currency = 'USD';
        const activeSymbols: ActiveSymbols = [
            {
                allow_forward_starting: 1,
                display_name: 'Volatility 100 (1s) Index',
                display_order: 3,
                exchange_is_open: 1,
                is_trading_suspended: 0,
                market: 'synthetic_index',
                market_display_name: 'Derived',
                pip: 0.01,
                subgroup: 'synthetics',
                subgroup_display_name: 'Synthetics',
                submarket: 'random_index',
                submarket_display_name: 'Continuous Indices',
                symbol: '1HZ100V',
                symbol_type: 'stockindex',
            },
        ];
        const returnValue = formatProfitTableTransactions(mockProfitTableTransactionData, currency, activeSymbols);
        expect(returnValue.display_name).toEqual('Volatility 100 (1s) Index');
    });
});
