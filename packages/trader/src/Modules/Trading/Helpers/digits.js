const digitCategoriesMap = [ 'even_odd', 'match_diff', 'over_under' ];
const digitTypesMap      = [ 'DIGITDIFF', 'DIGITMATCH', 'DIGITOVER', 'DIGITUNDER', 'DIGITEVEN', 'DIGITODD' ];

export const isDigitTradeType = (trade_type) => digitCategoriesMap.includes(trade_type);
export const isDigitContractType = (contract_type) => digitTypesMap.includes(contract_type);
