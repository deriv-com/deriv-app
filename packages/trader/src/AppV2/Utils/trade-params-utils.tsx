import { shouldShowExpiration, TRADE_TYPES } from '@deriv/shared';

export const getTradeParams = (symbol?: string) => ({
    [TRADE_TYPES.RISE_FALL]: ['duration', 'stake', 'allow_equals'],
    [TRADE_TYPES.RISE_FALL_EQUAL]: ['duration', 'stake', 'allow_equals'],
    [TRADE_TYPES.HIGH_LOW]: ['duration', 'barrier', 'stake'],
    [TRADE_TYPES.TOUCH]: ['duration', 'barrier', 'stake'],
    [TRADE_TYPES.MATCH_DIFF]: ['last_digit', 'duration', 'stake'],
    [TRADE_TYPES.EVEN_ODD]: ['duration', 'stake'],
    [TRADE_TYPES.OVER_UNDER]: ['last_digit', 'duration', 'stake'],
    [TRADE_TYPES.ACCUMULATOR]: ['growth_rate', 'stake', 'take_profit', 'accu_info_display'],
    [TRADE_TYPES.MULTIPLIER]: [
        'multiplier',
        'stake',
        'risk_management',
        ...(shouldShowExpiration(symbol) ? ['expiration'] : []),
        'mult_info_display',
    ],
    [TRADE_TYPES.TURBOS.LONG]: ['trade_type_tabs', 'duration', 'payout_per_point', 'stake', 'take_profit'],
    [TRADE_TYPES.TURBOS.SHORT]: ['trade_type_tabs', 'duration', 'payout_per_point', 'stake', 'take_profit'],
    [TRADE_TYPES.VANILLA.CALL]: ['trade_type_tabs', 'duration', 'strike', 'stake'],
    [TRADE_TYPES.VANILLA.PUT]: ['trade_type_tabs', 'duration', 'strike', 'stake'],
});
