import { config as qs_config } from '@deriv/bot-skeleton';
import { localize } from '@deriv/translations';
import { TConfigItem, TValidationItem } from '../types';

export const NUMBER_DEFAULT_VALIDATION: TValidationItem = {
    type: 'min',
    value: 1,
    getMessage: (min: string | number) => localize('Must be a number higher than {{ min }}', { min: Number(min) - 1 }),
};

export const LABEL_SYMBOL: TConfigItem = {
    type: 'label',
    label: localize('Asset'),
    description: localize('The underlying market your bot will trade with this strategy.'),
};

export const SYMBOL: TConfigItem = {
    type: 'symbol',
    name: 'symbol',
};

export const LABEL_TRADETYPE: TConfigItem = {
    type: 'label',
    label: localize('Contract type'),
    description: localize('Your bot will use this contract type for every run'),
};

export const TRADETYPE: TConfigItem = {
    type: 'tradetype',
    name: 'tradetype',
    dependencies: ['symbol'],
};

export const LABEL_PURCHASE_TYPE: TConfigItem = {
    type: 'label',
    label: localize('Purchase condition'),
    description: localize('Your bot uses a single trade type for each run.'),
};

export const PURCHASE_TYPE: TConfigItem = {
    type: 'contract_type',
    name: 'type',
    dependencies: ['symbol', 'tradetype'],
};

export const LABEL_STAKE: TConfigItem = {
    type: 'label',
    label: localize('Initial stake'),
    description: localize('The amount that you stake for the first trade. Note that this is the minimum stake amount.'),
};

export const STAKE: TConfigItem = {
    type: 'number',
    name: 'stake',
    validation: ['number', 'required', 'ceil', NUMBER_DEFAULT_VALIDATION],
    has_currency_unit: true,
};

export const LABEL_DURATION: TConfigItem = {
    type: 'label',
    label: localize('Duration'),
    description: localize('How long each trade takes to expire.'),
};

export const DURATION_TYPE: TConfigItem = {
    type: 'durationtype',
    name: 'durationtype',
    dependencies: ['symbol', 'tradetype'],
    attached: true,
};

export const DURATION: TConfigItem = {
    type: 'number',
    name: 'duration',
    attached: true,
    validation: ['number', 'required', 'min', 'max'],
};

export const LABEL_PROFIT: TConfigItem = {
    type: 'label',
    label: localize('Profit threshold'),
    description: localize('The bot will stop trading if your total profit exceeds this amount.'),
};

export const PROFIT: TConfigItem = {
    type: 'number',
    name: 'profit',
    validation: ['number', 'required', 'ceil', NUMBER_DEFAULT_VALIDATION],
    has_currency_unit: true,
};

export const LABEL_LOSS: TConfigItem = {
    type: 'label',
    label: localize('Loss threshold'),
    description: localize('The bot will stop trading if your total loss exceeds this amount.'),
};

export const LOSS: TConfigItem = {
    type: 'number',
    name: 'loss',
    validation: ['number', 'required', 'ceil', NUMBER_DEFAULT_VALIDATION],
    has_currency_unit: true,
};

export const LABEL_MARTINGALE_SIZE: TConfigItem = {
    type: 'label',
    label: localize('Size'),
    description: localize('The size used to multiply the stake after a losing trade for the next trade.'),
};

export const LABEL_REVERSE_MARTINGALE_SIZE: TConfigItem = {
    type: 'label',
    label: localize('Size'),
    description: localize('The size used to multiply the stake after a successful trade for the next trade.'),
};

export const SIZE: TConfigItem = {
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

export const LABEL_DALEMBERT_UNIT: TConfigItem = {
    type: 'label',
    label: localize('Unit'),
    description: localize(
        'Number of unit(s) to be added to the next trade after a losing trade. One unit is equivalent to the amount of initial stake.'
    ),
};

export const LABEL_REVERSE_DALEMBERT_UNIT: TConfigItem = {
    type: 'label',
    label: localize('Unit'),
    description: localize(
        'Number of unit(s) to be added to the next trade after a successful trade. One unit is equivalent to the amount of initial stake.'
    ),
};

export const UNIT: TConfigItem = {
    type: 'number',
    name: 'unit',
    validation: ['number', 'required', 'ceil', NUMBER_DEFAULT_VALIDATION],
};

export const CHECKBOX_MAX_STAKE: TConfigItem = {
    type: 'checkbox',
    name: 'boolean_max_stake',
    label: localize('Max stake'),
    description: localize('The stake for your next trade will reset to the initial stake if it exceeds this value.'),
    attached: true,
};

export const MAX_STAKE: TConfigItem = {
    type: 'number',
    name: 'max_stake',
    validation: ['number', 'required', 'ceil', 'min'],
    should_have: [{ key: 'boolean_max_stake', value: true }],
    hide_without_should_have: true,
    attached: true,
    has_currency_unit: true,
};

export const LABEL_LAST_DIGIT_PREDICTION: TConfigItem = {
    type: 'label',
    name: 'label_last_digit_prediction',
    label: localize('Last Digit Prediction'),
    description: localize('Your prediction of the last digit of the asset price.'),
    should_have: [{ key: 'tradetype', value: '', multiple: ['matchesdiffers', 'overunder'] }],
    hide_without_should_have: true,
};

export const LAST_DIGIT_PREDICTION: TConfigItem = {
    type: 'number',
    name: 'last_digit_prediction',
    validation: ['number', 'required', 'min', 'max', 'integer'],
    should_have: [{ key: 'tradetype', value: '', multiple: ['matchesdiffers', 'overunder'] }],
    hide_without_should_have: true,
};
