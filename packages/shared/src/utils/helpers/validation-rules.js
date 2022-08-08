import { localize } from '@deriv/translations';
import { getTotalProfit } from '../contract';
import { getBuyPrice } from './logic';

export const getContractValidationRules = () => ({
    has_contract_update_stop_loss: {
        trigger: 'contract_update_stop_loss',
    },
    contract_update_stop_loss: {
        rules: [
            [
                'req',
                {
                    condition: contract_store => !contract_store.contract_update_stop_loss,
                    message: localize('Please enter a stop loss amount.'),
                },
            ],
            [
                'custom',
                {
                    func: (value, options, contract_store) => {
                        const profit = getTotalProfit(contract_store.contract_info);
                        return !(profit < 0 && -value > profit);
                    },
                    message: localize("Please enter a stop loss amount that's higher than the current potential loss."),
                },
            ],
            [
                'custom',
                {
                    func: (value, options, contract_store) => {
                        const stake = getBuyPrice(contract_store);
                        return value < stake + 1;
                    },
                    message: localize('Invalid stop loss. Stop loss cannot be more than stake.'),
                },
            ],
        ],
    },
    has_contract_update_take_profit: {
        trigger: 'contract_update_take_profit',
    },
    contract_update_take_profit: {
        rules: [
            [
                'req',
                {
                    condition: contract_store => !contract_store.contract_update_take_profit,
                    message: localize('Please enter a take profit amount.'),
                },
            ],
            [
                'custom',
                {
                    func: (value, options, contract_store) => {
                        const profit = getTotalProfit(contract_store.contract_info);
                        return !(profit > 0 && +value < profit);
                    },
                    message: localize(
                        "Please enter a take profit amount that's higher than the current potential profit."
                    ),
                },
            ],
        ],
    },
});
