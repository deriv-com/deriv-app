import { CONTRACT_TYPES, shouldShowExpiration, TRADE_TYPES } from '@deriv/shared';

export const getTradeParams = (symbol?: string) => ({
    [TRADE_TYPES.RISE_FALL]: ['duration', 'stake', 'allow_equals'],
    [TRADE_TYPES.RISE_FALL_EQUAL]: ['duration', 'stake', 'allow_equals'],
    [TRADE_TYPES.HIGH_LOW]: ['duration', 'barrier', 'stake'],
    [TRADE_TYPES.TOUCH]: ['duration', 'barrier', 'stake'],
    [TRADE_TYPES.MATCH_DIFF]: ['last_digit', 'duration', 'stake'],
    [TRADE_TYPES.EVEN_ODD]: ['duration', 'stake'],
    [TRADE_TYPES.OVER_UNDER]: ['last_digit', 'duration', 'stake'],
    [TRADE_TYPES.ACCUMULATOR]: ['growth_rate', 'stake', 'take_profit'],
    [TRADE_TYPES.MULTIPLIER]: [
        'multiplier',
        'stake',
        'risk_management',
        ...(shouldShowExpiration(symbol) ? ['expiration'] : []),
    ],
    [TRADE_TYPES.TURBOS.LONG]: ['trade_type_tabs', 'duration', 'payout_per_point', 'stake', 'take_profit'],
    [TRADE_TYPES.TURBOS.SHORT]: ['trade_type_tabs', 'duration', 'payout_per_point', 'stake', 'take_profit'],
    [TRADE_TYPES.VANILLA.CALL]: ['trade_type_tabs', 'duration', 'strike', 'stake'],
    [TRADE_TYPES.VANILLA.PUT]: ['trade_type_tabs', 'duration', 'strike', 'stake'],
});

export const isDigitContractWinning = (
    contract_type: string | undefined,
    selected_digit: number | null,
    current_digit: number | null
) => {
    const win_conditions = {
        [CONTRACT_TYPES.MATCH_DIFF.MATCH]: current_digit === selected_digit,
        [CONTRACT_TYPES.MATCH_DIFF.DIFF]: current_digit !== selected_digit,
        [CONTRACT_TYPES.OVER_UNDER.OVER]:
            !!((current_digit || current_digit === 0) && (selected_digit || selected_digit === 0)) &&
            current_digit > selected_digit,
        [CONTRACT_TYPES.OVER_UNDER.UNDER]:
            !!((current_digit || current_digit === 0) && (selected_digit || selected_digit === 0)) &&
            current_digit < selected_digit,
        [CONTRACT_TYPES.EVEN_ODD.ODD]: !!current_digit && Boolean(current_digit % 2),
        [CONTRACT_TYPES.EVEN_ODD.EVEN]: (!!current_digit && !(current_digit % 2)) || current_digit === 0,
    } as { [key: string]: boolean };
    if (!contract_type || !win_conditions[contract_type]) return false;
    return win_conditions[contract_type];
};
