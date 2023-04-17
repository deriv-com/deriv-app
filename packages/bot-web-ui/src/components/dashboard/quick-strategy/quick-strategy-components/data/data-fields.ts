import { TDropdownItems, TInputBaseFields, TInputsFieldNames, TSelectsFieldNames } from '../../quick-strategy.types';
import { common_inputs_properties } from '..';
import { TCommonInputsProperties } from './common-input-properties';

const getMessage = (property: string) => `The bot will stop trading if your total ${property} exceeds this amount.`;

export type TDataFields = {
    id: string;
    field_name: TSelectsFieldNames | TInputsFieldNames;
    className?: string;
    input_value?: TInputBaseFields;
    select_value?: TDropdownItems;
    label: string;
    placeholder?: string;
    trailing_icon_message?: string;
    is_able_disabled?: boolean;
    is_uniq_strategy_field?: boolean;
} & Readonly<TCommonInputsProperties>;

const data_fields: ReadonlyArray<TDataFields> = [
    {
        id: 'type-strategy',
        field_name: 'quick-strategy__type-strategy',
        className: '',
        select_value: 'type-strategy',
        label: '',
    },
    {
        id: 'symbol',
        field_name: 'quick-strategy__symbol',
        className: 'quick-strategy__dropdown quick-strategy__leading',
        select_value: 'symbol',
        label: 'Asset',
    },
    {
        id: 'trade-type',
        field_name: 'quick-strategy__trade-type',
        className: 'quick-strategy__dropdown quick-strategy__leading',
        select_value: 'trade-type',
        label: 'Trade type',
    },
    {
        id: 'duration-unit',
        field_name: 'quick-strategy__duration-unit',
        className: '',
        select_value: 'duration-unit',
        label: 'Duration unit',
        is_able_disabled: true,
    },
    {
        id: 'duration-value',
        field_name: 'quick-strategy__duration-value',
        input_value: 'input_duration_value',
        label: 'Duration value',
        placeholder: '5',
        trailing_icon_message: 'The trade length of your purchased contract.',
        ...common_inputs_properties,
    },
    {
        id: 'stake',
        field_name: 'quick-strategy__stake',
        input_value: 'input_stake',
        label: 'Initial stake',
        placeholder: '10',
        trailing_icon_message: 'The amount that you pay to enter a trade.',
        ...common_inputs_properties,
    },
    {
        id: 'loss',
        field_name: 'quick-strategy__loss',
        input_value: 'input_loss',
        label: 'Loss threshold',
        placeholder: '5000',
        trailing_icon_message: getMessage('loss'),
        ...common_inputs_properties,
    },
    {
        id: 'strategy-data',
        is_uniq_strategy_field: true,
        label: '',
        field_name: '',
    },
    {
        id: 'profit',
        field_name: 'quick-strategy__profit',
        input_value: 'input_profit',
        label: 'Profit threshold',
        placeholder: '5000',
        trailing_icon_message: getMessage('profit'),
        ...common_inputs_properties,
    },
];

export default data_fields;
