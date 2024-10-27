import { localize } from '@deriv/translations';

export enum QsSteps {
    StrategySelect,
    StrategyVerified,
    StrategyCompleted,
}

type TTradeTypesItemsIndex = {
    [key: string]: string;
};

export const TRADE_TYPE_MAP: TTradeTypesItemsIndex = Object.freeze({
    ACCUMULATOR: localize('Accumulators'),
    OPTIONS: localize('Options'),
    // MULTIPLIERS: localize('Multipliers'),
});

// export const TRADE_TYPES = ['All', 'Accumulators', 'Options', 'Multipliers'];
export const TRADE_TYPES = [
    {
        label: localize('All'),
        value: 'ALL',
    },
    {
        label: TRADE_TYPE_MAP.ACCUMULATORS,
        value: 'ACCUMULATOR',
    },
    {
        label: TRADE_TYPE_MAP.OPTIONS,
        value: 'OPTIONS',
    },
];

export type TStrategy = {
    label: string;
};

export type TStrategyGroup = {
    [key: string]: TStrategy;
};

export type TStrategyList = {
    [key: string]: TStrategyGroup;
};

export const STRATEGY_LIST: TStrategyList = {
    ACCUMULATOR: {
        MARTINGALE_TICK_COUNT_TAKE_PROFIT: {
            label: localize('Martingale'),
        },
        MARTINGALE_STAT_RESET_TICK_COUNT_TAKE_PROFIT: {
            label: localize('Martingale with reset'),
        },
        // D_ALEMBERT: {
        //     label: localize(`D'Alembert`),
        // },
        // D_ALEMBERT_WITH_RESET: {
        //     label: localize(`D'Alembert with reset`),
        // },
        // REVERSE_MARTINGALE: {
        //     label: localize(`Reverse Martingale`),
        // },
        // REVERSE_MARTINGALE_WITH_RESET: {
        //     label: localize(`Reverse Martingale with reset`),
        // },
        // REVERSE_D_ALEMBERT: {
        //     label: localize(`Reverse D'Alembert`),
        // },
        // REVERSE_D_ALEMBERT_WITH_RESET: {
        //     label: localize(`Reverse D'Alembert with reset`),
        // },
    },
    OPTIONS: {
        MARTINGALE: {
            label: localize(`Martingale`),
        },
        D_ALEMBERT: {
            label: localize(`D'Alembert`),
        },
        REVERSE_MARTINGALE: {
            label: localize(`Reverse Martingale`),
        },
        REVERSE_D_ALEMBERT: {
            label: localize(`Reverse D'Alembert`),
        },
        OSCARS_GRIND: {
            label: localize(`Oscars Grind`),
        },
        STRATEGY_1_3_2_6: {
            label: localize(`Strategy 1-3-2-6`),
        },
    },
};
