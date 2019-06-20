import ContractType from '../Helpers/contract-type';

export const onChangeSymbolAsync = async(symbol) => {
    await ContractType.buildContractTypesConfig(symbol);
};
