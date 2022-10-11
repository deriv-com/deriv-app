import { localize } from '@deriv/translations';
import { getTotalProfit } from '../contract';
import { TGetTotalProfit } from '../contract/contract-types';
import { getBuyPrice } from './logic';

type TContractStore = {
    contract_update_stop_loss?: number;
    contract_info: TGetTotalProfit;
    contract_update_take_profit?: string;
};

type TOptions = {
    message?: string;
    min?: number;
    max?: number;
};

export const getContractValidationRules = () => ({
    has_contract_update_stop_loss: {
        trigger: 'contract_update_stop_loss',
    },
    contract_update_stop_loss: {
        rules: [
            [
                'req',
                {
                    condition: (contract_store: TContractStore) => !contract_store.contract_update_stop_loss,
                    message: localize('Please enter a stop loss amount.'),
                },
            ],
            [
                'custom',
                {
                    func: (value: number, options: TOptions, contract_store: TContractStore) => {
                        const profit = getTotalProfit(contract_store.contract_info);
                        return !(profit < 0 && -value > profit);
                    },
                    message: localize("Please enter a stop loss amount that's higher than the current potential loss."),
                },
            ],
            [
                'custom',
                {
                    func: (value: number, options: TOptions, contract_store: TContractStore) => {
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
                    condition: (contract_store: TContractStore) => !contract_store.contract_update_take_profit,
                    message: localize('Please enter a take profit amount.'),
                },
            ],
            [
                'custom',
                {
                    func: (value: string | number, options: TOptions, contract_store: TContractStore) => {
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
