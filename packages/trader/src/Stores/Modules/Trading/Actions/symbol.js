import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type.js';

export const onChangeSymbolAsync = async symbol => {
    await ContractType.buildContractTypesConfig(symbol);
};
