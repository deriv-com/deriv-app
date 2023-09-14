import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';

export const onChangeSymbolAsync = async symbol => {
    await ContractType.buildContractTypesConfig(symbol);
};
