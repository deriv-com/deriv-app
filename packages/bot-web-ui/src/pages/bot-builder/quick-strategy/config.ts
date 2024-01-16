import { config as qs_config } from '@deriv/bot-skeleton';
import { localize } from '@deriv/translations';
import {
    D_ALEMBERT,
    MARTINGALE,
    OSCARS_GRIND,
    REVERSE_D_ALEMBERT,
    REVERSE_MARTINGALE,
    STRATEGY_1_3_2_6,
} from '../../../constants/quick-strategies';
import { TConfigItem, TStrategies, TValidationItem } from './types';

export const FORM_TABS = [
    {
        label: localize('Trade parameters'),
        value: 'TRADE_PARAMETERS',
    },
    {
        label: localize('Learn more'),
        value: 'LEARN_MORE',
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
    label: localize('Trade type'),
    description: localize('Your bot will use this trade type for every run'),
};

const TRADETYPE: TConfigItem = {
    type: 'tradetype',
    name: 'tradetype',
    dependencies: ['symbol'],
};

const LABEL_PURCHASE_TYPE: TConfigItem = {
    type: 'label',
    label: localize('Purchase condition'),
    description: localize('Your bot uses a single trade type for each run.'),
};

const PURCHASE_TYPE: TConfigItem = {
    type: 'contract_type',
    name: 'type',
    dependencies: ['symbol', 'tradetype'],
};

const LABEL_STAKE: TConfigItem = {
    type: 'label',
    label: localize('Initial stake'),
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
    label: localize('Profit threshold'),
    description: localize('The bot will stop trading if your total profit exceeds this amount.'),
};

const PROFIT: TConfigItem = {
    type: 'number',
    name: 'profit',
    validation: ['number', 'required', 'ceil', NUMBER_DEFAULT_VALIDATION],
};

const LABEL_LOSS: TConfigItem = {
    type: 'label',
    label: localize('Loss threshold'),
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
        description: MARTINGALE,
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
        description: D_ALEMBERT,
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
        description: OSCARS_GRIND,
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
        description: REVERSE_MARTINGALE,
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
        description: REVERSE_D_ALEMBERT,
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
    STRATEGY_1_3_2_6: {
        name: 'STRATEGY_1_3_2_6',
        label: localize('1-3-2-6'),
        description: STRATEGY_1_3_2_6,
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
