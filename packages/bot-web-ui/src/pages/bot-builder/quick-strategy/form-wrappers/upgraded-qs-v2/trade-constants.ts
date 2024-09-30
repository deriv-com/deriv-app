import { localize } from '@deriv/translations';
import { STRATEGIES } from '../../config';

export enum QsSteps {
    StrategySelect,
    StrategyVerified,
    StrategyCompleted,
}

export type TStrategyValue = {
    id: number;
    label: string;
    name: string;
};

export type TTradeType = {
    id: number;
    name: string;
    value: TStrategyValue[];
};

const TRADE_TYPE_KIT: Record<string, TTradeType> = {
    // ACCUMULATOR: {
    //     id: 0,
    //     name: localize('Accumulator'),
    //     value: [
    //         {
    //             id: 0,
    //             label: STRATEGIES.MARTINGALE.label,
    //             name: 'MARTINGALE'
    //         },
    //         {
    //             id: 1,
    //             label: STRATEGIES.D_ALEMBERT.label,
    //             name: 'D_ALEMBERT'
    //         },
    //         {
    //             id: 2,
    //             label: STRATEGIES.REVERSE_MARTINGALE.label,
    //             name: 'REVERSE_MARTINGALE'
    //         },
    //         {
    //             id: 3,
    //             label: STRATEGIES.REVERSE_D_ALEMBERT.label,
    //             name: 'REVERSE_D_ALEMBERT'
    //         }
    //     ],
    // },
    OPTIONS: {
        id: 1,
        name: localize('Options'),
        value: [
            {
                id: 0,
                label: STRATEGIES.MARTINGALE.label,
                name: 'MARTINGALE',
            },
            {
                id: 1,
                label: STRATEGIES.D_ALEMBERT.label,
                name: 'D_ALEMBERT',
            },
            {
                id: 2,
                label: STRATEGIES.OSCARS_GRIND.label,
                name: 'OSCARS_GRIND',
            },
            {
                id: 3,
                label: STRATEGIES.REVERSE_MARTINGALE.label,
                name: 'REVERSE_MARTINGALE',
            },
            {
                id: 4,
                label: STRATEGIES.REVERSE_D_ALEMBERT.label,
                name: 'REVERSE_D_ALEMBERT',
            },
            {
                id: 5,
                label: STRATEGIES.STRATEGY_1_3_2_6.label,
                name: 'STRATEGY_1_3_2_6',
            },
        ],
    },
    // MULTIPLIERS: {
    //     id: 2,
    //     name: localize('Multipliers'),
    //     value: [
    //         {
    //             id: 0,
    //             label: STRATEGIES.MARTINGALE.label,
    //             name: 'MARTINGALE'
    //         },
    //         {
    //             id: 1,
    //             label: STRATEGIES.D_ALEMBERT.label,
    //             name: 'D_ALEMBERT'
    //         },
    //         {
    //             id: 2,
    //             label: STRATEGIES.REVERSE_MARTINGALE.label,
    //             name: 'REVERSE_MARTINGALE'
    //         },
    //         {
    //             id: 3,
    //             label: STRATEGIES.REVERSE_D_ALEMBERT.label,
    //             name: 'REVERSE_D_ALEMBERT'
    //         },
    //         {
    //             id: 4,
    //             label: STRATEGIES.STRATEGY_1_3_2_6.label,
    //             name: 'STRATEGY_1_3_2_6'
    //         }
    //     ],
    // },
};

export const TRADE_TYPE_STRATEGY: Record<string, TTradeType | TTradeType[]> = {
    // All: [TRADE_TYPE_KIT.ACCUMULATOR, TRADE_TYPE_KIT.MULTIPLIERS, TRADE_TYPE_KIT.OPTIONS],
    // Accumulator: TRADE_TYPE_KIT.ACCUMULATOR,
    Options: TRADE_TYPE_KIT.OPTIONS,
    // Multipliers: TRADE_TYPE_KIT.MULTIPLIERS,
};
