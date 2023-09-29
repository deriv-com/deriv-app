import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import { TTradeStore } from 'Types';

export const onChangeContractTypeList = ({ contract_types_list, contract_type }: TTradeStore) => {
    return ContractType.getContractType(contract_types_list, contract_type);
};

export const onChangeContractType = (store: TTradeStore) => {
    return ContractType.getContractValues(store);
};
