import { localize } from '@deriv/translations';
import { TDataFields } from '../../quick-strategy.types';
import { common_inputs_properties } from '..';

const getMessage = (property: string) => `The bot will stop trading if your total ${property} exceeds this amount.`;

export const TYPE_STRATEGY: TDataFields = {
    id: 'type-strategy',
    field_name: 'quick-strategy__type-strategy',
    className: '',
    select_value: 'type-strategy',
    label: '',
};
export const SYMBOL: TDataFields = {
    id: 'symbol',
    field_name: 'quick-strategy__symbol',
    className: 'quick-strategy__dropdown quick-strategy__leading',
    select_value: 'symbol',
    label: localize('Asset'),
};
export const TRADE_TYPE: TDataFields = {
    id: 'trade-type',
    field_name: 'quick-strategy__trade-type',
    className: 'quick-strategy__dropdown quick-strategy__leading',
    select_value: 'trade-type',
    label: localize('Trade type'),
};
export const DURATION_UNIT: TDataFields = {
    id: 'duration-unit',
    field_name: 'quick-strategy__duration-unit',
    className: '',
    select_value: 'duration-unit',
    label: localize('Duration unit'),
    is_able_disabled: true,
    group_by: 'trade_type',
};
export const DURATION_VALUE: TDataFields = {
    id: 'duration-value',
    field_name: 'quick-strategy__duration-value',
    input_value: 'input_duration_value',
    label: localize('Duration value'),
    placeholder: '5',
    trailing_icon_message: 'The trade length of your purchased contract.',
    group_by: 'trade_type',
    ...common_inputs_properties,
};
export const STAKE: TDataFields = {
    id: 'stake',
    field_name: 'quick-strategy__stake',
    input_value: 'input_stake',
    label: localize('Initial stake'),
    placeholder: '10',
    trailing_icon_message: 'The amount that you pay to enter a trade.',
    group_by: 'trade_type',
    ...common_inputs_properties,
};
export const LOSS: TDataFields = {
    id: 'loss',
    field_name: 'quick-strategy__loss',
    input_value: 'input_loss',
    label: localize('Loss threshold'),
    placeholder: '5000',
    trailing_icon_message: getMessage('loss'),
    group_by: 'trade_type',
    ...common_inputs_properties,
};
export const STRATEGY_DATA: TDataFields = {
    id: 'strategy-data',
    is_uniq_strategy_field: true,
    label: '',
    field_name: '',
};
export const PROFIT: TDataFields = {
    id: 'profit',
    field_name: 'quick-strategy__profit',
    input_value: 'input_profit',
    label: localize('Profit threshold'),
    placeholder: '5000',
    trailing_icon_message: getMessage('profit'),
    group_by: 'trade_type',
    ...common_inputs_properties,
};
