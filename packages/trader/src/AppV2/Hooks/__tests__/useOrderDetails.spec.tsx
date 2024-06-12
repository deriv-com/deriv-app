import { renderHook } from '@testing-library/react-hooks';
import { CONTRACT_TYPES, TContractInfo } from '@deriv/shared';
import useOrderDetails from '../useOrderDetails';

jest.mock('@deriv/translations', () => ({
    localize: jest.fn(text => text),
}));

jest.mock('@deriv/shared', () => ({
    CONTRACT_TYPES: {
        TURBOS: { LONG: 'turbos_long', SHORT: 'turbos_short' },
        MULTIPLIER: { DOWN: 'multiplier_down', UP: 'multiplier_up' },
        MATCH_DIFF: { MATCH: 'match_diff_match', DIFF: 'match_diff_diff' },
        EVEN_ODD: { EVEN: 'even_odd_even', ODD: 'even_odd_odd' },
        OVER_UNDER: { OVER: 'over_under_over', UNDER: 'over_under_under' },
        RESET: { CALL: 'reset_call' },
        PUT: 'put',
        CALLE: 'calle',
        CALL: 'call',
        TOUCH: { ONE_TOUCH: 'touch_one_touch', NO_TOUCH: 'touch_no_touch' },
        ACCUMULATOR: 'accumulator',
        VANILLA: { CALL: 'vanilla_call', PUT: 'vanilla_put' },
    },
    getDurationPeriod: jest.fn(),
    getDurationTime: jest.fn(),
    getDurationUnitText: jest.fn(),
    getGrowthRatePercentage: jest.fn(() => '10'),
    isAccumulatorContract: jest.fn(),
    isResetContract: jest.fn(),
    addComma: jest.fn(),
}));

jest.mock('App/Components/Elements/PositionsDrawer/helpers', () => ({
    getBarrierValue: jest.fn(),
}));

const mockData: TContractInfo = {
    transaction_ids: { buy: 12345, sell: 67890 },
    buy_price: 100,
    currency: 'USD',
    tick_count: 5,
    tick_passed: 3,
    contract_type: '',
    display_number_of_contracts: '1',
    commission: 5,
    limit_order: {
        take_profit: { order_amount: 200 },
        stop_loss: { order_amount: 50 },
        stop_out: { order_amount: 30 },
    },
    barrier: '1000',
    growth_rate: 10,
    entry_spot_display_value: '1000',
    is_expired: 1,
    is_sold: 1,
};

describe('useOrderDetails', () => {
    it('should return correct details for Multiplier contract', () => {
        mockData.contract_type = CONTRACT_TYPES.MULTIPLIER.UP;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            'Reference ID': ['12345 (Buy)', '67890 (Sell)'],
            Multiplier: '',
            Stake: '100.00 USD',
            Commission: '5 USD',
            'Take Profit': '200.00 USD',
            'Stop loss': '50.00 USD',
            'Stop out level': '30.00 USD',
        });
    });

    it('should return correct details for Rise contract', () => {
        mockData.contract_type = CONTRACT_TYPES.CALL;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            'Reference ID': ['12345 (Buy)', '67890 (Sell)'],
            Duration: '5 ticks',
            Barrier: '1000',
            Stake: '100.00 USD',
        });
    });

    it('should return correct details for Turbos contract', () => {
        mockData.contract_type = CONTRACT_TYPES.TURBOS.LONG;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            'Reference ID': ['12345 (Buy)', '67890 (Sell)'],
            Duration: '5 ticks',
            Barrier: '1000',
            'Payout per point': '1',
            Stake: '100.00 USD',
            'Take Profit': '200.00 USD',
        });
    });

    it('should return correct details for Matcher contract', () => {
        mockData.contract_type = CONTRACT_TYPES.MATCH_DIFF.MATCH;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            'Reference ID': ['12345 (Buy)', '67890 (Sell)'],
            Duration: ' ',
            Target: undefined,
            Stake: '100.00 USD',
        });
    });

    it('should return correct details for Accumulator contract', () => {
        mockData.contract_type = CONTRACT_TYPES.ACCUMULATOR;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            'Reference ID': ['12345 (Buy)', '67890 (Sell)'],
            Duration: '5 ticks',
            'Growth rate': '10%',
            Stake: '100.00 USD',
            'Take Profit': '200 USD',
        });
    });

    it('should return correct details for Vanilla contract', () => {
        mockData.contract_type = CONTRACT_TYPES.VANILLA.CALL;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            'Reference ID': ['12345 (Buy)', '67890 (Sell)'],
            'Strike Price': ' - ',
            Duration: ' ',
            'Payout per point': '1',
            Stake: '100.00 USD',
        });
    });

    it('should return default details for unknown contract type', () => {
        mockData.contract_type = 'unknown';
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({});
    });

    it('should handle missing contract type', () => {
        mockData.contract_type = '';
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current).toBeUndefined();
    });

    it('should handle contracts without limit_order', () => {
        const modifiedData = { ...mockData, limit_order: undefined };
        modifiedData.contract_type = CONTRACT_TYPES.MULTIPLIER.UP;
        const { result } = renderHook(() => useOrderDetails(modifiedData));
        expect(result.current?.details).toEqual({
            'Reference ID': ['12345 (Buy)', '67890 (Sell)'],
            Multiplier: '',
            Stake: '100.00 USD',
            Commission: '5 USD',
            'Take Profit': 'Not set',
            'Stop loss': 'Not set',
            'Stop out level': '',
        });
    });
});
