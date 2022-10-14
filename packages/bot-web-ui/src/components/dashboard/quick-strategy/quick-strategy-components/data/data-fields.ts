import { data_uniq_input_obj, common_inputs_properties } from '..';
import { TSelectsFieldNames, TDropdownItems, TInputBaseFields, TInputsFieldNames } from '../../quick-strategy.types';
import { TDataUniqInput } from './data-uniq-input-obj';
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
    is_basic_field?: boolean;
} & Readonly<TCommonInputsProperties>;

const data_fields: ReadonlyArray<TDataFields | ReadonlyArray<TDataUniqInput>> = [
    {
        id: 'type-strategy',
        field_name: 'quick-strategy__type-strategy',
        className: '',
        select_value: 'type-strategy',
        label: '',
        is_basic_field: true,
    },
    {
        id: 'symbol',
        field_name: 'quick-strategy__symbol',
        className: 'quick-strategy__dropdown quick-strategy__leading',
        select_value: 'symbol',
        label: 'Asset',
        is_basic_field: true,
    },
    {
        id: 'trade-type',
        field_name: 'quick-strategy__trade-type',
        className: 'quick-strategy__dropdown quick-strategy__leading',
        select_value: 'trade-type',
        label: 'Trade type',
        is_basic_field: true,
    },
    {
        id: 'duration-unit',
        field_name: 'quick-strategy__duration-unit',
        className: '',
        select_value: 'duration-unit',
        label: 'Duration unit',
        is_able_disabled: true,
        is_basic_field: true,
    },
    {
        id: 'duration-value',
        field_name: 'quick-strategy__duration-value',
        input_value: 'input_duration_value',
        label: 'Duration value',
        placeholder: '5',
        trailing_icon_message: 'The trade length of your purchased contract.',
        is_basic_field: true,
        ...common_inputs_properties,
    },
    {
        id: 'stake',
        field_name: 'quick-strategy__stake',
        input_value: 'input_stake',
        label: 'Initial stake',
        placeholder: '10',
        trailing_icon_message: 'The amount that you pay to enter a trade.',
        is_basic_field: true,
        ...common_inputs_properties,
    },
    {
        id: 'loss',
        field_name: 'quick-strategy__loss',
        input_value: 'input_loss',
        label: 'Loss threshold',
        placeholder: '5000',
        trailing_icon_message: getMessage('loss'),
        is_basic_field: true,
        ...common_inputs_properties,
    },
    ...[data_uniq_input_obj],
    {
        id: 'profit',
        field_name: 'quick-strategy__profit',
        input_value: 'input_profit',
        label: 'Profit threshold',
        placeholder: '5000',
        trailing_icon_message: getMessage('profit'),
        is_basic_field: true,
        ...common_inputs_properties,
    },
];

export default data_fields;
