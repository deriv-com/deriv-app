import { localize } from 'App/i18n';

const getValidationRules = () => ({
    contract_update_stop_loss: {
        rules: [
            ['req', { condition: store => store.contract_update_stop_loss, message: localize('Enter stop loss') }],
        ],
    },
    contract_update_take_profit: {
        rules: [
            ['req', { condition: store => store.contract_update_take_profit, message: localize('Enter take profit') }],
        ],
    },
});

export default getValidationRules;
