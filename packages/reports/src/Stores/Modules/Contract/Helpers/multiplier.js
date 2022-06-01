import { connect } from '../../../connect';

// eslint-disable-next-line no-empty-pattern
export const connectWithContractUpdate = connect(({}, { contract = {} }) => {
    return {
        validation_errors: contract.validation_errors,
        contract_update_take_profit: contract.contract_update_take_profit,
        contract_update_stop_loss: contract.contract_update_stop_loss,
        has_contract_update_take_profit: contract.has_contract_update_take_profit,
        has_contract_update_stop_loss: contract.has_contract_update_stop_loss,
    };
});
