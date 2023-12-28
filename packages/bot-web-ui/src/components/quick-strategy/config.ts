import { config as qs_config } from '@deriv/bot-skeleton';
import { localize } from '@deriv/translations';
import { D_ALEMBERT, MARTINGALE, OSCARS_GRIND, REVERSE_MARTINGALE } from './descriptions';
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

const NUMBER_DEFAULT_VALIDATION: TValidationItem = {
    type: 'min',
    value: 1,
    getMessage: (min: string | number) => localize('Must be a number higher than {{ min }}', { min: Number(min) - 1 }),
};

const LABEL_SYMBOL: TConfigItem = {
    type: 'label',
    label: localize('Asset'),
    description: localize('The underlying market your bot will trade with this strategy.'),
};

const SYMBOL: TConfigItem = {
    type: 'symbol',
    name: 'symbol',
};

const LABEL_TRADETYPE: TConfigItem = {
    type: 'label',
    label: localize('Trade Type'),
    description: localize('Your bot will use this trade type for every run'),
};

const TRADETYPE: TConfigItem = {
    type: 'tradetype',
    name: 'tradetype',
    dependencies: ['symbol'],
};

const LABEL_PURCHASE_TYPE: TConfigItem = {
    type: 'label',
    label: localize('Purchase Condition'),
    description: localize('Your bot uses a single trade type for each run.'),
};

const PURCHASE_TYPE: TConfigItem = {
    type: 'contract_type',
    name: 'type',
    dependencies: ['symbol', 'tradetype'],
};

const LABEL_STAKE: TConfigItem = {
    type: 'label',
    label: localize('Initial Stake'),
    description: localize('The amount that you pay to enter a trade.'),
};

const STAKE: TConfigItem = {
    type: 'number',
    name: 'stake',
    validation: ['number', 'required', 'ceil', NUMBER_DEFAULT_VALIDATION],
};

const LABEL_DURATION: TConfigItem = {
    type: 'label',
    label: localize('Duration'),
    description: localize('How long each trade takes to expire.'),
};

const DURATION_TYPE: TConfigItem = {
    type: 'durationtype',
    name: 'durationtype',
    dependencies: ['symbol', 'tradetype'],
    attached: true,
};

const DURATION: TConfigItem = {
    type: 'number',
    name: 'duration',
    attached: true,
    validation: ['number', 'required', 'min', 'max'],
};

const LABEL_PROFIT: TConfigItem = {
    type: 'label',
    label: localize('Profit Threshold'),
    description: localize('The bot will stop trading if your total profit exceeds this amount.'),
};

const PROFIT: TConfigItem = {
    type: 'number',
    name: 'profit',
    validation: ['number', 'required', 'ceil', NUMBER_DEFAULT_VALIDATION],
};

const LABEL_LOSS: TConfigItem = {
    type: 'label',
    label: localize('Loss Threshold'),
    description: localize('The bot will stop trading if your total loss exceeds this amount.'),
};

const LOSS: TConfigItem = {
    type: 'number',
    name: 'loss',
    validation: ['number', 'required', 'ceil', NUMBER_DEFAULT_VALIDATION],
};

const LABEL_SIZE: TConfigItem = {
    type: 'label',
    label: localize('Size'),
    description: localize(
        'The multiplier amount used to increase your stake if you’re losing a trade. Value must be higher than 1.'
    ),
};

const SIZE: TConfigItem = {
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

const LABEL_DALEMBERT_UNIT: TConfigItem = {
    type: 'label',
    label: localize('Unit'),
    description: localize("The amount that you may add to your stake if you're losing a trade."),
};

const UNIT: TConfigItem = {
    type: 'number',
    name: 'unit',
    validation: ['number', 'required', 'ceil', NUMBER_DEFAULT_VALIDATION],
};

const CHECKBOX_MAX_STAKE: TConfigItem = {
    type: 'checkbox',
    name: 'boolean_max_stake',
    label: localize('Max stake'),
    description: localize('The stake for your next trade will reset to the initial stake if it exceeds this value.'),
    attached: true,
};

const MAX_STAKE: TConfigItem = {
    type: 'number',
    name: 'max_stake',
    validation: ['number', 'required', 'ceil', 'min'],
    should_have: [{ key: 'boolean_max_stake', value: true }],
    attached: true,
};

const LABEL_LAST_DIGIT_PREDICTION: TConfigItem = {
    type: 'label',
    name: 'label_last_digit_prediction',
    label: localize('Last Digit Prediction'),
    description: localize('Your prediction of the last digit of the asset price.'),
    should_have: [{ key: 'tradetype', value: '', multiple: ['matchesdiffers', 'overunder'] }],
    hide_without_should_have: true,
};

const LAST_DIGIT_PREDICTION: TConfigItem = {
    type: 'number',
    name: 'last_digit_prediction',
    validation: ['number', 'required', 'min', 'max', 'integer'],
    should_have: [{ key: 'tradetype', value: '', multiple: ['matchesdiffers', 'overunder'] }],
    hide_without_should_have: true,
};

export const STRATEGIES: TStrategies = {
    MARTINGALE: {
        name: 'martingale_max-stake',
        label: localize('Martingale'),
        description: localize(
            'The Martingale strategy multiplies the stake by the chosen multiplier after every losing trade. The stake for the next trade resets to the initial stake after a successful trade. To manage risk, set the maximum stake for a single trade. The stake for the next trade will reset to the initial stake if it exceeds the maximum stake.'
        ),
        long_description: MARTINGALE,
        fields: [
            [
                LABEL_SYMBOL,
                SYMBOL,
                LABEL_TRADETYPE,
                TRADETYPE,
                LABEL_PURCHASE_TYPE,
                PURCHASE_TYPE,
                LABEL_LAST_DIGIT_PREDICTION,
                LAST_DIGIT_PREDICTION,
                LABEL_STAKE,
                STAKE,
                LABEL_DURATION,
                DURATION_TYPE,
                DURATION,
            ],
            [LABEL_PROFIT, PROFIT, LABEL_LOSS, LOSS, LABEL_SIZE, SIZE, CHECKBOX_MAX_STAKE, MAX_STAKE],
        ],
    },
    D_ALEMBERT: {
        name: 'dalembert_max-stake',
        label: localize('D’Alembert'),
        description: localize(
            "The D'Alembert strategy increases the stake after a losing trade and reduces the stake after a successful trade by the number of units that traders decide. One unit is equal to the amount of the initial stake. To manage risk, set the maximum stake for a single trade. The stake for the next trade will reset to the initial stake if it exceeds the maximum stake."
        ),
        long_description: D_ALEMBERT,
        fields: [
            [
                LABEL_SYMBOL,
                SYMBOL,
                LABEL_TRADETYPE,
                TRADETYPE,
                LABEL_PURCHASE_TYPE,
                PURCHASE_TYPE,
                LABEL_LAST_DIGIT_PREDICTION,
                LAST_DIGIT_PREDICTION,
                LABEL_STAKE,
                STAKE,
                LABEL_DURATION,
                DURATION_TYPE,
                DURATION,
            ],
            [LABEL_PROFIT, PROFIT, LABEL_LOSS, LOSS, LABEL_DALEMBERT_UNIT, UNIT, CHECKBOX_MAX_STAKE, MAX_STAKE],
        ],
    },
    OSCARS_GRIND: {
        name: 'oscars_grind_max-stake',
        label: localize('Oscar’s Grind'),
        description: localize(
            "The Oscar's Grind strategy aims to potentially make one unit of profit per session. A new session starts when the target profit is reached. If a losing trade is followed by a successful one, the stake increases by one unit. In every other scenario, the stake for the next trade will be the same as the previous one. If the stake for the next trade exceeds the gap between the target profit and current loss of the session, it adjusts to the gap size. To manage risk, set the maximum stake for a single trade. The stake for the next trade will reset to the initial stake if it exceeds the maximum stake."
        ),
        long_description: OSCARS_GRIND,
        fields: [
            [
                LABEL_SYMBOL,
                SYMBOL,
                LABEL_TRADETYPE,
                TRADETYPE,
                LABEL_PURCHASE_TYPE,
                PURCHASE_TYPE,
                LABEL_LAST_DIGIT_PREDICTION,
                LAST_DIGIT_PREDICTION,
                LABEL_STAKE,
                STAKE,
                LABEL_DURATION,
                DURATION_TYPE,
                DURATION,
            ],
            [LABEL_PROFIT, PROFIT, LABEL_LOSS, LOSS, CHECKBOX_MAX_STAKE, MAX_STAKE],
        ],
    },
    REVERSE_MARTINGALE: {
        name: 'reverse_martingale',
        label: localize('Reverse Martingale'),
        description: localize(
            'The Reverse Martingale strategy multiplies the stake by the chosen multiplier after every successful trade. The stake for the next trade will reset to the initial stake after a losing trade. To manage risk, set the maximum stake for a single trade. The stake for the next trade will reset to the initial stake if it exceeds the maximum stake.'
        ),
        long_description: REVERSE_MARTINGALE,
        fields: [
            [
                LABEL_SYMBOL,
                SYMBOL,
                LABEL_TRADETYPE,
                TRADETYPE,
                LABEL_PURCHASE_TYPE,
                PURCHASE_TYPE,
                LABEL_LAST_DIGIT_PREDICTION,
                LAST_DIGIT_PREDICTION,
                LABEL_STAKE,
                STAKE,
                LABEL_DURATION,
                DURATION_TYPE,
                DURATION,
            ],
            [LABEL_PROFIT, PROFIT, LABEL_LOSS, LOSS, LABEL_SIZE, SIZE, CHECKBOX_MAX_STAKE, MAX_STAKE],
        ],
    },
    REVERSE_D_ALEMBERT: {
        name: 'reverse_dalembert',
        label: localize('Reverse D’Alembert'),
        description: localize(
            "The Reverse D'Alembert strategy increases the stake after a successful trade and reduces the stake after a losing trade by the number of units that traders decide. One unit is equal to the amount of the initial stake. To manage risk, set the maximum stake for a single trade. The stake for the next trade will reset to the initial stake if it exceeds the maximum stake."
        ),
        fields: [
            [
                LABEL_SYMBOL,
                SYMBOL,
                LABEL_TRADETYPE,
                TRADETYPE,
                LABEL_PURCHASE_TYPE,
                PURCHASE_TYPE,
                LABEL_LAST_DIGIT_PREDICTION,
                LAST_DIGIT_PREDICTION,
                LABEL_STAKE,
                STAKE,
                LABEL_DURATION,
                DURATION_TYPE,
                DURATION,
            ],
            [LABEL_PROFIT, PROFIT, LABEL_LOSS, LOSS, LABEL_DALEMBERT_UNIT, UNIT, CHECKBOX_MAX_STAKE, MAX_STAKE],
        ],
    },
    '1_3_2_6': {
        name: '1_3_2_6',
        label: localize('1-3-2-6'),
        description: localize(
            'The 1-3-2-6 strategy aims to maximise profits with four consecutive wins. One unit is equal to the amount of the initial stake. The stake will adjust from 1 unit to 3 units after the first successful trade, then to 2 units after your second successful trade, and to 6 units after the third successful trade. The stake for the next trade will reset to the initial stake if there is a losing trade or a completion of the trade cycle.'
        ),
        fields: [
            [
                LABEL_SYMBOL,
                SYMBOL,
                LABEL_TRADETYPE,
                TRADETYPE,
                LABEL_PURCHASE_TYPE,
                PURCHASE_TYPE,
                LABEL_LAST_DIGIT_PREDICTION,
                LAST_DIGIT_PREDICTION,
                LABEL_STAKE,
                STAKE,
                LABEL_DURATION,
                DURATION_TYPE,
                DURATION,
            ],
            [LABEL_PROFIT, PROFIT, LABEL_LOSS, LOSS],
        ],
    },
};
