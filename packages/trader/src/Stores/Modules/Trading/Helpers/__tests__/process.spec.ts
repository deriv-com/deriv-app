import { processTradeParams } from '../process';
import { mockStore } from '@deriv/stores';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getExpiryType: () => 'tick',
}));

describe('processTradeParams', () => {
    const new_state = {
        is_equal: 1,
    };
    const mock_store = mockStore({}).modules.trade;
    const trade_store = {
        ...mock_store,
        updateStore: jest.fn(),
        getSnapshot: jest.fn(() => ({ ...mock_store })),
    };

    it('updates the trade parameters correctly', async () => {
        await processTradeParams(trade_store, new_state);
        expect(trade_store.updateStore).toHaveBeenCalled();
        expect(trade_store.is_trade_enabled).toBe(true);
        expect(trade_store.is_trade_enabled_v2).toBe(true);
    });
});
