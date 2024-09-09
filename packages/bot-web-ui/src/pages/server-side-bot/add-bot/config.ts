import { localize } from '@deriv/translations';
import { MARTINGALE } from '../../../constants/quick-strategies';
import { SERVER_BOT_CONFIG } from '../config';
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
    label: localize('Contract Duration'),
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

const SIZE: TConfigItem = {
    type: 'number',
    name: 'size',
    validation: [
        'number',
        'required',
        'floor',
        {
            type: 'min',
            value: String(SERVER_BOT_CONFIG.DEFAULT.size),
            getMessage: (min: string | number) =>
                localize('The value must be equal or greater than {{ min }}', { min }),
        },
    ],
};

const LABEL_NMAE: TConfigItem = {
    type: 'label',
    label: localize('Name'),
    description: localize('Name of your bot'),
};

const NAME: TConfigItem = {
    type: 'text',
    name: 'name',
    validation: ['required'],
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
            [LABEL_NMAE, NAME],
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
            [LABEL_PROFIT, PROFIT, LABEL_LOSS, LOSS, LABEL_MARTINGALE_SIZE, SIZE],
        ],
    },
};
