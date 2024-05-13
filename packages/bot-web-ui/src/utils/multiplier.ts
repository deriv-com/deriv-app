import { ContractUpdate, ProposalOpenContract } from '@deriv/api-types';
import { getLimitOrderAmount } from '@deriv/shared';

type TContractUpdateConfig = (ContractUpdate & ProposalOpenContract['limit_order']) | undefined;
/**
 * Set contract update form initial values
 * @param {object} contract_update - contract_update response
 * @param {object} limit_order - proposal_open_contract.limit_order response
 */
export const getContractUpdateConfig = (contract_update_config: TContractUpdateConfig) => {
    const { stop_loss, take_profit } = getLimitOrderAmount(contract_update_config);

    return {
        // convert stop_loss, take_profit value to string for validation to work
        contract_update_stop_loss: stop_loss ? Math.abs(stop_loss).toString() : '',
        contract_update_take_profit: take_profit ? take_profit.toString() : '',
        has_contract_update_stop_loss: !!stop_loss,
        has_contract_update_take_profit: !!take_profit,
    };
};
