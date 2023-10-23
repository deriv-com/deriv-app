import { config as qs_config } from '@deriv/bot-skeleton';
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

export const tradetype: TConfigItem = {
    type: 'tradetype',
    fullWidth: true,
    name: 'tradetype',
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
    validation: ['number', 'required', 'ceil', number_min_validation],
};

export const label_duration: TConfigItem = {
    type: 'label',
    label: localize('Duration'),
    description: localize('The trade length of your purchased contract.'),
    hide: ['desktop'],
};

export const durationtype: TConfigItem = {
    type: 'durationtype',
    name: 'durationtype',
    dependencies: ['symbol', 'tradetype'],
    attached: true,
};

export const duration: TConfigItem = {
    type: 'number',
    name: 'duration',
    attached: true,
    validation: ['number', 'required', 'min', 'max'],
};

export const label_profit: TConfigItem = {
    type: 'label',
    label: localize('Profit Threshold'),
    description: localize(`The bot will stop trading if your total profit exceeds this amount.`),
};

export const profit: TConfigItem = {
    type: 'number',
    name: 'profit',
    validation: ['number', 'required', 'ceil', number_min_validation],
};

export const label_loss: TConfigItem = {
    type: 'label',
    label: localize('Loss Threshold'),
    description: localize(`The bot will stop trading if your total loss exceeds this amount.`),
};

export const loss: TConfigItem = {
    type: 'number',
    name: 'loss',
    validation: ['number', 'required', 'ceil', number_min_validation],
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
        'required',
        'floor',
        {
            type: 'min',
            value: String(qs_config.QUICK_STRATEGY.DEFAULT.size),
            getMessage: (min: string | number) =>
                localize('The value must be equal or greater than {{ min }}', { min }),
        },
    ],
};

export const label_unit_d_alembert: TConfigItem = {
    type: 'label',
    label: localize('Unit'),
    description: localize("The amount that you may add to your stake if you're losing a trade."),
};

export const label_unit_oscars_grind: TConfigItem = {
    type: 'label',
    label: localize('Unit'),
    description: localize('The amount that you may add to your stake after each successful trade.'),
};

export const unit: TConfigItem = {
    type: 'number',
    name: 'unit',
    validation: ['number', 'required', 'ceil', number_min_validation],
};

export const config: TConfigItem[][] = [
    [symbol, tradetype, label_initial_stake, initial_stake, durationtype, duration],
    [label_profit, profit, label_loss, loss, label_size, size],
];

export const STRATEGIES: TStrategies = {
    MARTINGALE: {
        name: 'martingale',
        label: localize('Martingale'),
        description: localize(
            'The Martingale strategy multiplies the stake by the chosen multiplier after every losing trade. The stake for the next trade resets to the initial stake after a successful trade. To manage risk, set the maximum stake for a single trade. The stake for the next trade will reset to the initial stake if it exceeds the maximum stake.'
        ),
        fields: [
            [symbol, tradetype, label_initial_stake, initial_stake, label_duration, durationtype, duration],
            [label_profit, profit, label_loss, loss, label_size, size],
        ],
    },
    D_ALEMBERT: {
        name: 'dalembert',
        label: localize('D’Alembert'),
        description: localize(
            "The D'Alembert strategy increases the stake after a losing trade and reduces the stake after a successful trade by the number of units that traders decide. One unit is equal to the amount of the initial stake. To manage risk, set the maximum stake for a single trade. The stake for the next trade will reset to the initial stake if it exceeds the maximum stake."
        ),
        fields: [
            [symbol, tradetype, label_initial_stake, initial_stake, label_duration, durationtype, duration],
            [label_profit, profit, label_loss, loss, label_unit_d_alembert, unit],
        ],
    },
    OSCARS_GRIND: {
        name: 'oscars_grind',
        label: localize('Oscar’s Grind'),
        description: localize(
            "The Oscar's Grind strategy aims to potentially make one unit of profit per session. A new session starts when the target profit is reached. If a losing trade is followed by a successful one, the stake increases by one unit. In every other scenario, the stake for the next trade will be the same as the previous one. If the stake for the next trade exceeds the gap between the target profit and current loss of the session, it adjusts to the gap size. To manage risk, set the maximum stake for a single trade. The stake for the next trade will reset to the initial stake if it exceeds the maximum stake."
        ),
        fields: [
            [symbol, tradetype, label_initial_stake, initial_stake, label_duration, durationtype, duration],
            [label_profit, profit, label_loss, loss, label_unit_oscars_grind, unit],
        ],
    },
};
