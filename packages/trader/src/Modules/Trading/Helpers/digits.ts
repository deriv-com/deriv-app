import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';

const digitCategoriesMap = [TRADE_TYPES.EVEN_ODD, TRADE_TYPES.MATCH_DIFF, TRADE_TYPES.OVER_UNDER] as const;
const digitTypesMap = [
    CONTRACT_TYPES.MATCH_DIFF.DIFF,
    CONTRACT_TYPES.MATCH_DIFF.MATCH,
    CONTRACT_TYPES.OVER_UNDER.OVER,
    CONTRACT_TYPES.OVER_UNDER.UNDER,
    CONTRACT_TYPES.EVEN_ODD.EVEN,
    CONTRACT_TYPES.EVEN_ODD.ODD,
] as const;

export const isDigitTradeType = (trade_type = '') => digitCategoriesMap.some(item => item === trade_type);
export const isDigitContractType = (contract_type: string) => digitTypesMap.some(item => item === contract_type);
