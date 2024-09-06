export const SERVER_BOT_CONFIG = {
    DISABLED: {
        SYMBOLS: ['1HZ150V', '1HZ250V'],
        SUBMARKETS: ['crash_index', 'non_stable_coin', 'step_index'],
        BARRIER_TRADE_TYPES: ['higherlower', 'touchnotouch', 'endsinout', 'staysinout', 'callputspread', 'accumulator'],
        PREDICTION_TRADE_TYPES: ['highlowticks'],
    },
    DEFAULT: {
        symbol: '1HZ100V',
        tradetype: 'callput',
        durationtype: 't',
        size: 1,
        unit: 1,
        prediction: 0,
    },
};
