import { localize } from '@deriv/translations';
import { STRATEGIES } from '../config';

export enum QsSteps {
    StrategySelect,
    StrategyVerified,
    StrategyCompleted,
}

type TTradeTypesItemsIndex = {
    [key: string]: number;
};

export const TRADE_TYPE_INDEX: TTradeTypesItemsIndex = Object.freeze({
    ALL: 0,
    // MULTIPLIERS: 2,
    ACCUMULATORS: 1,
    OPTIONS: 2,
});

// export const TRADE_TYPES = ['All', 'Accumulators', 'Options', 'Multipliers'];
export const TRADE_TYPES = [localize('All'), localize('Accumulators'), localize('Options')];

export type TTStrategyTradeAssociation = {
    name: string;
    display_name: string;
    id: number;
    parent: Array<string>;
};

export type TStrategyTradeAssociations = Array<TTStrategyTradeAssociation>;

export const STRATEGY_TRADE_ASSOCIATIONS: TStrategyTradeAssociations = [
    {
        name: 'MARTINGALE',
        display_name: STRATEGIES.MARTINGALE.label,
        id: 0,
        parent: [localize('Options')],
    },
    {
        name: 'D_ALEMBERT',
        display_name: STRATEGIES.D_ALEMBERT.label,
        id: 1,
        parent: [localize('Options')],
    },
    {
        name: 'REVERSE_MARTINGALE',
        display_name: STRATEGIES.REVERSE_MARTINGALE.label,
        id: 2,
        parent: [localize('Options')],
    },
    {
        name: 'REVERSE_D_ALEMBERT',
        display_name: STRATEGIES.REVERSE_D_ALEMBERT.label,
        id: 3,
        parent: [localize('Options')],
    },
    {
        name: 'OSCARS_GRIND',
        display_name: STRATEGIES.OSCARS_GRIND.label,
        id: 4,
        parent: [localize('Options')],
    },
    {
        name: 'STRATEGY_1_3_2_6',
        display_name: STRATEGIES.STRATEGY_1_3_2_6.label,
        id: 5,
        parent: [localize('Options')],
    },
    {
        name: 'ACCUMULATORS_MARTINGALE',
        display_name: STRATEGIES.ACCUMULATORS_MARTINGALE.label,
        id: 6,
        parent: [localize('Accumulators')],
    },
    {
        name: 'ACCUMULATORS_MARTINGALE_ON_STAT_RESET',
        display_name: STRATEGIES.ACCUMULATORS_MARTINGALE_ON_STAT_RESET.label,
        id: 7,
        parent: [localize('Accumulators')],
    },
    {
        name: 'ACCUMULATORS_DALEMBERT',
        display_name: STRATEGIES.ACCUMULATORS_DALEMBERT.label,
        id: 8,
        parent: [localize('Accumulators')],
    },
    {
        name: 'ACCUMULATORS_DALEMBERT_ON_STAT_RESET',
        display_name: STRATEGIES.ACCUMULATORS_DALEMBERT_ON_STAT_RESET.label,
        id: 9,
        parent: [localize('Accumulators')],
    },
    {
        name: 'ACCUMULATORS_REVERSE_MARTINGALE',
        display_name: STRATEGIES.ACCUMULATORS_REVERSE_MARTINGALE.label,
        id: 10,
        parent: [localize('Accumulators')],
    },
    {
        name: 'ACCUMULATORS_REVERSE_MARTINGALE_ON_STAT_RESET',
        display_name: STRATEGIES.ACCUMULATORS_REVERSE_MARTINGALE_ON_STAT_RESET.label,
        id: 11,
        parent: [localize('Accumulators')],
    },
    {
        name: 'ACCUMULATORS_REVERSE_DALEMBERT',
        display_name: STRATEGIES.ACCUMULATORS_REVERSE_DALEMBERT.label,
        id: 12,
        parent: [localize('Accumulators')],
    },
    {
        name: 'ACCUMULATORS_REVERSE_DALEMBERT_ON_STAT_RESET',
        display_name: STRATEGIES.ACCUMULATORS_REVERSE_DALEMBERT_ON_STAT_RESET.label,
        id: 13,
        parent: [localize('Accumulators')],
    },
];
