const digitTypesMap = [ 'even_odd', 'match_diff', 'over_under' ];

export const isDigitTradeType = (contract_type) => digitTypesMap.includes(contract_type);
