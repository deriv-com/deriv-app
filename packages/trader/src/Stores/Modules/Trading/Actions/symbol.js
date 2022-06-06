import { ContractType } from '@deriv/shared';

export const onChangeSymbolAsync = async symbol => {
    await ContractType.buildContractTypesConfig(symbol);
};
