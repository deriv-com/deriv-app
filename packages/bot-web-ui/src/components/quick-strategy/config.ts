import { localize } from '@deriv/translations';

import { TConfigItem, TStrategies, TValidationItem } from './types';

export const FORM_TABS = [
    {
        label: localize('Trade Parameters'),
        value: 'TRADE_PARAMETERS',
    },
    {
        label: localize('Description'),
        value: 'DESCRIPTION',
        disabled: true,
    },
];

export const SIZE_MIN = 2;

const number_min_validation: TValidationItem = {
    type: 'min',
    value: 1,
    getMessage: (min: string | number) => localize('Must be a number higher than {{ min }}', { min: Number(min) - 1 }),
};

export const symbol: TConfigItem = {
    type: 'symbol',
    fullWidth: true,
    name: 'symbol',
};

export const trade_type: TConfigItem = {
    type: 'trade_type',
    fullWidth: true,
    name: 'trade_type',
    dependencies: ['symbol'],
};

export const label_initial_stake: TConfigItem = {
    type: 'label',
    label: localize('Initial Stake'),
    description: localize('The amount that you pay to enter a trade.'),
};

export const initial_stake: TConfigItem = {
    type: 'number',
    name: 'stake',
    validation: ['number', 'ceil', number_min_validation],
};

export const label_duration: TConfigItem = {
    type: 'label',
    label: localize('Duration'),
    description: localize('The trade length of your purchased contract.'),
    hide: ['desktop'],
};

export const duration_unit: TConfigItem = {
    type: 'duration_unit',
    name: 'duration_unit',
    dependencies: ['symbol', 'trade_type'],
    attached: true,
};

export const duration_value: TConfigItem = {
    type: 'number',
    name: 'duration_value',
    attached: true,
    validation: ['number', 'required', 'min', 'max'],
};

export const label_profit_threshold: TConfigItem = {
    type: 'label',
    label: localize('Profit Threshold'),
    description: localize(`The bot will stop trading if your total ${'Profit'} exceeds this amount.`),
};

export const profit_threshold: TConfigItem = {
    type: 'number',
    name: 'profit_threshold',
    validation: ['number', 'ceil', number_min_validation],
};

export const label_loss_threshold: TConfigItem = {
    type: 'label',
    label: localize('Loss Threshold'),
    description: localize(`The bot will stop trading if your total ${'Profit'} exceeds this amount.`),
};

export const loss_threshold: TConfigItem = {
    type: 'number',
    name: 'loss_threshold',
    validation: ['number', 'ceil', number_min_validation],
};

export const label_size: TConfigItem = {
    type: 'label',
    label: localize('Size'),
    description: localize(
        'The multiplier amount used to increase your stake if you’re losing a trade. Value must be higher than 2.'
    ),
};

export const size: TConfigItem = {
    type: 'number',
    name: 'size',
    validation: [
        'number',
        'floor',
        {
            type: 'min',
            value: SIZE_MIN,
            getMessage: (min: string | number) =>
                localize('The value must be equal or greater than {{ min }}', { min }),
        },
    ],
};

export const label_unit: TConfigItem = {
    type: 'label',
    label: localize('Unit'),
    description: localize(
        'The multiplier amount used to increase your stake if you’re losing a trade. Value must be higher than 2.'
    ),
};

export const unit: TConfigItem = {
    type: 'number',
    name: 'unit',
    validation: ['number', 'ceil', number_min_validation],
};

export const config: TConfigItem[][] = [
    [symbol, trade_type, label_initial_stake, initial_stake, duration_unit, duration_value],
    [label_profit_threshold, profit_threshold, label_loss_threshold, loss_threshold, label_size, size],
];

export const STRATEGIES: TStrategies = {
    MARTINGALE: {
        name: 'martingale',
        label: localize('Martingale'),
        description: localize(
            'The Martingale doubles your stake after a loss and resets your stake after a win or when the pre-determined number of consecutive losses is reached. You decide your profit threshold, loss threshold, initial stake, and the number of consecutive losses before your stake resets.'
        ),
        fields: [
            [symbol, trade_type, label_initial_stake, initial_stake, label_duration, duration_unit, duration_value],
            [label_profit_threshold, profit_threshold, label_loss_threshold, loss_threshold, label_size, size],
        ],
    },
    D_ALEMBERT: {
        name: 'dalembert',
        label: localize('D’Alembert'),
        description: localize(
            'The concept of the D’Alembert Strategy is said to be similar to the Martingale Strategy where you will increase your contract size after a loss. With the D’Alembert Strategy, you will also decrease your contract size after a successful trade.'
        ),
        fields: [
            [symbol, trade_type, label_initial_stake, initial_stake, label_duration, duration_unit, duration_value],
            [label_profit_threshold, profit_threshold, label_loss_threshold, loss_threshold, label_unit, unit],
        ],
    },
    OSCARS_GRIND: {
        name: 'oscars_grind',
        label: localize('Oscar’s Grind'),
        description: localize(
            'The Oscar’s Grind Strategy is a low-risk positive progression strategy that first appeared in 1965. By using this strategy, the size of your contract will increase after successful trades, but remains unchanged after unsuccessful trades.'
        ),
        fields: [
            [symbol, trade_type, label_initial_stake, initial_stake, label_duration, duration_unit, duration_value],
            [label_profit_threshold, profit_threshold, label_loss_threshold, loss_threshold, label_unit, unit],
        ],
    },
};
