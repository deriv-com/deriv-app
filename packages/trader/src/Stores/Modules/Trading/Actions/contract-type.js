import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type.js';

export const onChangeContractTypeList = ({ contract_types_list, contract_type }) =>
    ContractType.getContractType(contract_types_list, contract_type);

export const onChangeContractType = store => ContractType.getContractValues(store);
