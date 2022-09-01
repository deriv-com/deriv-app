import { data_uniq_input_obj, common_inputs_properties } from '.';

const getMessage = (property: string) => `The bot will stop trading if your total ${property} exceeds this amount.`;

const data_fields: Array<any> = [
    Object.freeze({
        id: 'base__types-strategies',
        name: 'base__types-strategies',
        field_name: 'quick-strategy__types-strategies',
        className: '',
        input_value: 'type-strategy',
        label: '',
    }),
    Object.freeze({
        id: 'base__symbol',
        name: 'base__symbol',
        field_name: 'quick-strategy__symbol',
        className: 'quick-strategy__dropdown quick-strategy__leading',
        input_value: 'symbol',
        label: 'Asset',
    }),
    Object.freeze({
        id: 'base__trade-type',
        name: 'base__trade-type',
        field_name: 'quick-strategy__trade-type',
        className: 'quick-strategy__dropdown quick-strategy__leading',
        input_value: 'trade-type',
        label: 'Trade type',
    }),
    Object.freeze({
        id: 'base__duration-unit',
        name: 'base__duration-unit',
        field_name: 'quick-strategy__duration-unit',
        className: '',
        input_value: 'duration-unit',
        label: 'Duration unit',
        is_able_disabled: 'true',
    }),
    Object.freeze({
        id: 'base__duration-value',
        name: 'base__duration-value',
        field_name: 'quick-strategy__duration-value',
        input_value: 'input_duration_value',
        label: 'Duration value',
        placeholder: '5',
        trailing_icon_message: 'The trade length of your purchased contract.',
        ...common_inputs_properties,
    }),
    Object.freeze({
        id: 'base__stake',
        name: 'base__stake',
        field_name: 'quick-strategy__stake',
        input_value: 'input_stake',
        label: 'Initial stake',
        placeholder: '10',
        trailing_icon_message: 'The amount that you pay to enter a trade.',
        ...common_inputs_properties,
    }),
    Object.freeze({
        id: 'base__loss',
        name: 'base__loss',
        field_name: 'quick-strategy__loss',
        input_value: 'input_loss',
        label: 'Loss threshold',
        placeholder: '5000',
        trailing_icon_message: getMessage('loss'),
        ...common_inputs_properties,
    }),
    ...[data_uniq_input_obj],
    Object.freeze({
        id: 'base__profit',
        name: 'base__profit',
        field_name: 'quick-strategy__profit',
        input_value: 'input_profit',
        label: 'Profit threshold',
        placeholder: '5000',
        trailing_icon_message: getMessage('profit'),
        ...common_inputs_properties,
    }),
];

export default data_fields;
