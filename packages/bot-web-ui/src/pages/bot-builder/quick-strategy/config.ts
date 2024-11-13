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
import { LocalizeHTMLForSellConditions } from './localize_html';

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
    label: localize('Contract type'),
    description: localize('Your bot will use this contract type for every run'),
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

const SELL_CONDITIONS_TYPE_INFO: TConfigItem = {
    type: 'label',
    label: localize('Sell conditions'),
    description: LocalizeHTMLForSellConditions,
};

// This will trigger the boolean_tick_count value to render the take profit and tick count fields
const SELL_CONDITIONS_TYPE: TConfigItem = {
    type: 'sell_conditions',
    name: 'sell_conditions',
};

const LABEL_STAKE: TConfigItem = {
    type: 'label',
    label: localize('Initial stake'),
    description: localize('The amount that you stake for the first trade. Note that this is the minimum stake amount.'),
};

const STAKE: TConfigItem = {
    type: 'number',
    name: 'stake',
    validation: ['number', 'required', 'ceil', NUMBER_DEFAULT_VALIDATION],
    has_currency_unit: true,
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
    has_currency_unit: true,
};

const GROWTH_RATE: TConfigItem = {
    type: 'label',
    label: localize('Growth rate'),
    description: localize(
        'Your stake will grow at the specified growth rate per tick as long as the current spot price remains within the range of the previous spot price.'
    ),
};

const GROWTH_RATE_VALUE: TConfigItem = {
    type: 'growth_rate',
    name: 'growth_rate',
    attached: true,
    validation: ['number', 'required', 'ceil'],
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
    has_currency_unit: true,
};

const LABEL_MARTINGALE_SIZE: TConfigItem = {
    type: 'label',
    label: localize('Size'),
    description: localize('The size used to multiply the stake after a losing trade for the next trade.'),
};

const LABEL_ACCUMULAORTS_UNIT: TConfigItem = {
    type: 'label',
    label: localize('Unit'),
    description: localize('The unit used to multiply the stake after a losing trade for the next trade.'),
};

const LABEL_ACCUMULAORTS_SIZE: TConfigItem = {
    type: 'label',
    label: localize('Size'),
    description: localize('The size used to multiply the stake after a successful trade for the next trade.'),
};

const LABEL_REVERSE_MARTINGALE_SIZE: TConfigItem = {
    type: 'label',
    label: localize('Size'),
    description: localize('The size used to multiply the stake after a successful trade for the next trade.'),
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
    description: localize(
        'Number of unit(s) to be added to the next trade after a losing trade. One unit is equivalent to the amount of initial stake.'
    ),
};

const LABEL_REVERSE_DALEMBERT_UNIT: TConfigItem = {
    type: 'label',
    label: localize('Unit'),
    description: localize(
        'Number of unit(s) to be added to the next trade after a successful trade. One unit is equivalent to the amount of initial stake.'
    ),
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
    hide_without_should_have: true,
    attached: true,
    has_currency_unit: true,
};

const TAKE_PROFIT: TConfigItem = {
    type: 'number',
    name: 'take_profit',
    should_have: [{ key: 'boolean_tick_count', value: false }],
    hide_without_should_have: true,
    attached: true,
    has_currency_unit: true,
};

const TICK_COUNT = {
    type: 'number',
    name: 'tick_count',
    should_have: [{ key: 'boolean_tick_count', value: true }],
    hide_without_should_have: true,
    attached: true,
    has_currency_unit: false,
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
        rs_strategy_name: 'martingale',
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
            [LABEL_PROFIT, PROFIT, LABEL_LOSS, LOSS, LABEL_MARTINGALE_SIZE, SIZE, CHECKBOX_MAX_STAKE, MAX_STAKE],
        ],
    },
    D_ALEMBERT: {
        name: 'dalembert_max-stake',
        label: localize('D’Alembert'),
        rs_strategy_name: `d'alembert`,
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
        rs_strategy_name: `oscar's-grind`,
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
        rs_strategy_name: 'reverse martingale',
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
            [
                LABEL_PROFIT,
                PROFIT,
                LABEL_LOSS,
                LOSS,
                LABEL_REVERSE_MARTINGALE_SIZE,
                SIZE,
                CHECKBOX_MAX_STAKE,
                MAX_STAKE,
            ],
        ],
    },
    REVERSE_D_ALEMBERT: {
        name: 'reverse_dalembert',
        label: localize('Reverse D’Alembert'),
        rs_strategy_name: `reverse d'alembert`,
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
            [LABEL_PROFIT, PROFIT, LABEL_LOSS, LOSS, LABEL_REVERSE_DALEMBERT_UNIT, UNIT, CHECKBOX_MAX_STAKE, MAX_STAKE],
        ],
    },
    STRATEGY_1_3_2_6: {
        name: '1_3_2_6',
        label: localize('1-3-2-6'),
        rs_strategy_name: '1-3-2-6',
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
    ACCUMULATORS_MARTINGALE: {
        name: 'accumulators_martingale',
        label: localize('Martingale'),
        rs_strategy_name: `ACCUMULATORS_MARTINGALE`,
        description: [],
        fields: [
            [LABEL_SYMBOL, SYMBOL, LABEL_STAKE, STAKE, GROWTH_RATE, GROWTH_RATE_VALUE],
            [
                LABEL_PROFIT,
                PROFIT,
                LABEL_LOSS,
                LOSS,
                LABEL_ACCUMULAORTS_SIZE,
                SIZE,
                SELL_CONDITIONS_TYPE_INFO,
                SELL_CONDITIONS_TYPE,
                TAKE_PROFIT,
                TICK_COUNT,
                CHECKBOX_MAX_STAKE,
                MAX_STAKE,
            ],
        ],
    },
    ACCUMULATORS_DALEMBERT: {
        name: 'accumulators_dalembert',
        label: localize('D’Alembert'),
        rs_strategy_name: `ACCUMULATORS_DALEMBERT`,
        description: [],
        fields: [
            [LABEL_SYMBOL, SYMBOL, LABEL_STAKE, STAKE, GROWTH_RATE, GROWTH_RATE_VALUE],
            [
                LABEL_PROFIT,
                PROFIT,
                LABEL_LOSS,
                LOSS,
                LABEL_ACCUMULAORTS_UNIT,
                UNIT,
                SELL_CONDITIONS_TYPE_INFO,
                SELL_CONDITIONS_TYPE,
                TAKE_PROFIT,
                TICK_COUNT,
                CHECKBOX_MAX_STAKE,
                MAX_STAKE,
            ],
        ],
    },
    ACCUMULATORS_MARTINGALE_ON_STAT_RESET: {
        name: 'accumulators_martingale_on_stat_reset',
        label: localize('Martingale on Stat Reset'),
        rs_strategy_name: `ACCUMULATORS_MARTINGALE_ON_STAT_RESET`,
        description: [],
        fields: [
            [LABEL_SYMBOL, SYMBOL, LABEL_STAKE, STAKE, GROWTH_RATE, GROWTH_RATE_VALUE],
            [
                LABEL_PROFIT,
                PROFIT,
                LABEL_LOSS,
                LOSS,
                LABEL_ACCUMULAORTS_SIZE,
                SIZE,
                SELL_CONDITIONS_TYPE_INFO,
                SELL_CONDITIONS_TYPE,
                TAKE_PROFIT,
                TICK_COUNT,
                CHECKBOX_MAX_STAKE,
                MAX_STAKE,
            ],
        ],
    },
    ACCUMULATORS_DALEMBERT_ON_STAT_RESET: {
        name: 'accumulators_dalembert_on_stat_reset',
        label: localize("D'Alembert on Stat Reset"),
        rs_strategy_name: `ACCUMULATORS_DALEMBERT_ON_STAT_RESET`,
        description: [],
        fields: [
            [LABEL_SYMBOL, SYMBOL, LABEL_STAKE, STAKE, GROWTH_RATE, GROWTH_RATE_VALUE],
            [
                LABEL_PROFIT,
                PROFIT,
                LABEL_LOSS,
                LOSS,
                LABEL_ACCUMULAORTS_UNIT,
                UNIT,
                SELL_CONDITIONS_TYPE_INFO,
                SELL_CONDITIONS_TYPE,
                TAKE_PROFIT,
                TICK_COUNT,
                CHECKBOX_MAX_STAKE,
                MAX_STAKE,
            ],
        ],
    },
    ACCUMULATORS_REVERSE_MARTINGALE: {
        name: 'accumulators_reverse_martingale',
        label: localize('Reverse Martingale'),
        rs_strategy_name: `ACCUMULATORS_REVERSE_MARTINGALE`,
        description: [],
        fields: [
            [LABEL_SYMBOL, SYMBOL, LABEL_STAKE, STAKE, GROWTH_RATE, GROWTH_RATE_VALUE],
            [
                LABEL_PROFIT,
                PROFIT,
                LABEL_LOSS,
                LOSS,
                LABEL_ACCUMULAORTS_SIZE,
                SIZE,
                SELL_CONDITIONS_TYPE_INFO,
                SELL_CONDITIONS_TYPE,
                TAKE_PROFIT,
                TICK_COUNT,
                CHECKBOX_MAX_STAKE,
                MAX_STAKE,
            ],
        ],
    },
    ACCUMULATORS_REVERSE_MARTINGALE_ON_STAT_RESET: {
        name: 'accumulators_reverse_martingale_on_stat_reset',
        label: localize('Reverse Martingale on Stat Reset'),
        rs_strategy_name: `ACCUMULATORS_REVERSE_MARTINGALE_ON_STAT_RESET`,
        description: [],
        fields: [
            [LABEL_SYMBOL, SYMBOL, LABEL_STAKE, STAKE, GROWTH_RATE, GROWTH_RATE_VALUE],
            [
                LABEL_PROFIT,
                PROFIT,
                LABEL_LOSS,
                LOSS,
                LABEL_ACCUMULAORTS_SIZE,
                SIZE,
                SELL_CONDITIONS_TYPE_INFO,
                SELL_CONDITIONS_TYPE,
                TAKE_PROFIT,
                TICK_COUNT,
                CHECKBOX_MAX_STAKE,
                MAX_STAKE,
            ],
        ],
    },
    ACCUMULATORS_REVERSE_DALEMBERT: {
        name: 'accumulators_reverse_dalembert',
        label: localize("Reverse D'Alembert"),
        rs_strategy_name: `ACCUMULATORS_REVERSE_DALEMBERT`,
        description: [],
        fields: [
            [LABEL_SYMBOL, SYMBOL, LABEL_STAKE, STAKE, GROWTH_RATE, GROWTH_RATE_VALUE],
            [
                LABEL_PROFIT,
                PROFIT,
                LABEL_LOSS,
                LOSS,
                LABEL_ACCUMULAORTS_UNIT,
                UNIT,
                SELL_CONDITIONS_TYPE_INFO,
                SELL_CONDITIONS_TYPE,
                TAKE_PROFIT,
                TICK_COUNT,
                CHECKBOX_MAX_STAKE,
                MAX_STAKE,
            ],
        ],
    },
    ACCUMULATORS_REVERSE_DALEMBERT_ON_STAT_RESET: {
        name: 'accumulators_reverse_dalembert_on_stat_reset',
        label: localize("Reverse D'Alembert on Stat Reset"),
        rs_strategy_name: `ACCUMULATORS_REVERSE_DALEMBERT_ON_STAT_RESET`,
        description: [],
        fields: [
            [LABEL_SYMBOL, SYMBOL, LABEL_STAKE, STAKE, GROWTH_RATE, GROWTH_RATE_VALUE],
            [
                LABEL_PROFIT,
                PROFIT,
                LABEL_LOSS,
                LOSS,
                LABEL_ACCUMULAORTS_UNIT,
                UNIT,
                SELL_CONDITIONS_TYPE_INFO,
                SELL_CONDITIONS_TYPE,
                TAKE_PROFIT,
                TICK_COUNT,
                CHECKBOX_MAX_STAKE,
                MAX_STAKE,
            ],
        ],
    },
};
