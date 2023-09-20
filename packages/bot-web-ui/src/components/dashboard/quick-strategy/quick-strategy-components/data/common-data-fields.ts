import { localize } from '@deriv/translations';
import { INPUT_TYPES, OPERATORS } from 'Constants/quick-strategies-validation';
import { popover_zindex } from 'Constants/z-indexes';
import { TDataFields } from '../../quick-strategy.types';

const getMessage = (property: string) => `The bot will stop trading if your total ${property} exceeds this amount.`;

export const TYPE_STRATEGY: TDataFields = {
    id: 'type-strategy',
    field_name: 'strategy',
    className: '',
    select_value: 'type-strategy',
    label: '',
    type: INPUT_TYPES.SELECT,
};
export const SYMBOL: TDataFields = {
    id: 'symbol',
    field_name: 'symbol',
    className: 'quick-strategy__dropdown quick-strategy__leading',
    select_value: 'symbol',
    label: localize('Asset'),
    group_by: 'asset-type',
    type: INPUT_TYPES.SELECT,
};
export const TRADE_TYPE: TDataFields = {
    id: 'trade-type',
    field_name: 'tradetype',
    className: 'quick-strategy__dropdown quick-strategy__leading',
    select_value: 'trade-type',
    label: localize('Trade type'),
    group_by: 'asset-type',
    type: INPUT_TYPES.SELECT,
};
export const DURATION_UNIT: TDataFields = {
    id: 'duration-unit',
    field_name: 'durationtype',
    className: '',
    select_value: 'duration-unit',
    label: localize('Duration unit'),
    is_able_disabled: true,
    group_by: 'asset-type',
    type: INPUT_TYPES.SELECT,
};
export const DURATION_VALUE: TDataFields = {
    id: 'duration-value',
    field_name: 'duration',
    input_value: 'input_duration_value',
    label: localize('Duration value'),
    type: INPUT_TYPES.NUMBER,
    placeholder: '5',
    trailing_icon_message: 'The trade length of your purchased contract.',
    group_by: 'asset-type',
    className: 'quick-strategy__input',
    zIndex: popover_zindex.QUICK_STRATEGY,
};
export const STAKE: TDataFields = {
    id: 'stake',
    field_name: 'stake',
    input_value: 'input_stake',
    label: localize('Initial stake'),
    placeholder: '10',
    trailing_icon_message: 'The amount that you pay to enter a trade.',
    group_by: 'trade-type',
    type: INPUT_TYPES.NUMBER,
    className: 'quick-strategy__input',
    zIndex: popover_zindex.QUICK_STRATEGY,
};
export const LOSS: TDataFields = {
    id: 'loss',
    field_name: 'loss',
    input_value: 'input_loss',
    label: localize('Loss threshold'),
    placeholder: '5000',
    trailing_icon_message: getMessage('loss'),
    group_by: 'trade-type',
    type: INPUT_TYPES.NUMBER,
    className: 'quick-strategy__input',
    zIndex: popover_zindex.QUICK_STRATEGY,
};
export const PROFIT: TDataFields = {
    id: 'profit',
    field_name: 'profit',
    input_value: 'input_profit',
    label: localize('Profit threshold'),
    placeholder: '5000',
    trailing_icon_message: getMessage('profit'),
    group_by: 'trade-type',
    type: INPUT_TYPES.NUMBER,
    className: 'quick-strategy__input',
    zIndex: popover_zindex.QUICK_STRATEGY,
};
