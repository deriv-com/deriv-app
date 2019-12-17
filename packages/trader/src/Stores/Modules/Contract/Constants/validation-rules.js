import { localize }               from 'deriv-translations';
import { getProfitLossFromStore } from 'Stores/Modules/Contract/Helpers/logic';

const getValidationRules = () => ({
    contract_update_stop_loss: {
        rules: [
            ['req', { condition: store => store.contract_update_stop_loss, message: localize('Enter stop loss') }],
            ['custom' , { func: (value, options, store) => {
                const profit = getProfitLossFromStore(store.root_store.modules);
                return !(profit < 0 && -value > profit);
            }, message: localize('Stop loss must be lower than current potential loss.') }],
        ],
    },
    contract_update_take_profit: {
        rules: [
            ['req', { condition: store => store.contract_update_take_profit, message: localize('Enter take profit') }],
            ['custom' , { func: (value, options, store) => {
                const profit = getProfitLossFromStore(store.root_store.modules);
                return !(profit > 0 && +value < profit);
            }, message: localize('Take profit must be higher than current potential profit.') }],
        ],
    },
});

export default getValidationRules;
