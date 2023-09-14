import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';

export const onChangeContractTypeList = ({ contract_types_list, contract_type }) => {
    return ContractType.getContractType(contract_types_list, contract_type);
};
export const onChangeContractType = store => ContractType.getContractValues(store);
