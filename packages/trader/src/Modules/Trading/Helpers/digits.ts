const digitCategoriesMap = ['even_odd', 'match_diff', 'over_under'] as const;
const digitTypesMap = ['DIGITDIFF', 'DIGITMATCH', 'DIGITOVER', 'DIGITUNDER', 'DIGITEVEN', 'DIGITODD'] as const;

export const isDigitTradeType = (trade_type: string) => digitCategoriesMap.some(item => item === trade_type);
export const isDigitContractType = (contract_type: string) => digitTypesMap.some(item => item === contract_type);
