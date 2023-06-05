const digitCategoriesMap = ['even_odd', 'match_diff', 'over_under'] as const;
const digitTypesMap = ['DIGITDIFF', 'DIGITMATCH', 'DIGITOVER', 'DIGITUNDER', 'DIGITEVEN', 'DIGITODD'] as const;

export const isDigitTradeType = (trade_type: string): boolean =>
    digitCategoriesMap.find(item => item === trade_type) !== undefined;

export const isDigitContractType = (contract_type: string): boolean =>
    digitTypesMap.find(item => item === contract_type) !== undefined;
