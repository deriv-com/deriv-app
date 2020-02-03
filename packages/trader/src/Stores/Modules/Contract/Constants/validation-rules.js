import { localize } from '@deriv/translations';
import { getBuyPrice, getProfit } from 'Stores/Modules/Contract/Helpers/logic';

const getValidationRules = () => ({
    contract_update_stop_loss: {
        rules: [
            [
                'req',
                {
                    condition: store => store.contract_update_stop_loss,
                    message: localize('Please enter a stop loss amount.'),
                },
            ],
            [
                'custom',
                {
                    func: (value, options, store) => {
                        const profit = getProfit(store.root_store.modules);
                        return !(profit < 0 && -value > profit);
                    },
                    message: localize("Please enter a stop loss amount that's higher than the current potential loss."),
                },
            ],
            [
                'custom',
                {
                    func: (value, options, store) => {
                        const stake = getBuyPrice(store.root_store.modules);
                        return value < stake + 1;
                    },
                    message: localize('Invalid stop loss. Stop loss cannot be more than stake.'),
                },
            ],
        ],
    },
    contract_update_take_profit: {
        rules: [
            [
                'req',
                {
                    condition: store => store.contract_update_take_profit,
                    message: localize('Please enter a take profit amount.'),
                },
            ],
            [
                'custom',
                {
                    func: (value, options, store) => {
                        const profit = getProfit(store.root_store.modules);
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

export default getValidationRules;
