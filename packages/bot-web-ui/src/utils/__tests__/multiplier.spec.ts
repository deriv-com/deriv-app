import { getContractUpdateConfig } from 'Utils/multiplier';

describe('Multiplier Util', () => {
    it('should return the buy price from contract_store', () => {
        const contract_store = {
            contract_info: {
                buy_price: 100,
            },
        };
        const buyPrice = contract_store.contract_info.buy_price;
        expect(buyPrice).toBe(100);
    });

    it('should return contract update config with stop loss and take profit', () => {
        const limit_order = {
            stop_loss: { order_amount: 100 },
            take_profit: { order_amount: 200 },
        };
        const config = getContractUpdateConfig(limit_order);

        expect(config.contract_update_stop_loss).toBe('100');

        expect(config.contract_update_take_profit).toBe('200');
        expect(config.has_contract_update_stop_loss).toBe(true);
        expect(config.has_contract_update_take_profit).toBe(true);
    });

    it('should handle missing limit_order', () => {
        const config = getContractUpdateConfig(undefined);

        expect(config.contract_update_stop_loss).toBe('');
        expect(config.contract_update_take_profit).toBe('');
        expect(config.has_contract_update_stop_loss).toBe(false);
        expect(config.has_contract_update_take_profit).toBe(false);
    });
});
