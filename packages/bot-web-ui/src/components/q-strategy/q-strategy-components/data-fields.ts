import { popover_zindex } from 'Constants/z-indexes';
import QuickStrategyStore from 'Stores/quick-strategy-store';

const quick_strategy_store = new QuickStrategyStore();

const common_inputs_properties = {
    label_className: 'quick-strategy__input-label',
    field_className: 'quick-strategy__input-field',
    className: 'quick-strategy__input',
    zIndex: popover_zindex.QUICK_STRATEGY,
};

const getMessage = property => `The bot will stop trading if your total ${property} exceeds this amount.`;

const data_fields = [
    {
        id: 'base__types-strategies',
        name: 'base__types-strategies',
        field_name: 'quick-strategy__types-strategies',
        className: '',
        input_value: 'type-strategy',
        label: '',
        isDouble: true, //?
    },
    {
        id: 'base__symbol',
        name: 'base__symbol',
        field_name: 'quick-strategy__symbol',
        className: 'quick-strategy__dropdown quick-strategy__leading',
        input_value: 'symbol',
        label: 'Asset',
    },
    {
        id: 'base__trade-type',
        name: 'base__trade-type',
        field_name: 'quick-strategy__trade-type',
        className: 'quick-strategy__dropdown quick-strategy__leading',
        input_value: 'trade-type',
        label: 'Trade type',
    },
    {
        id: 'base__duration-unit',
        name: 'base__duration-unit',
        field_name: 'quick-strategy__duration-unit',
        className: '',
        input_value: 'duration-unit',
        label: 'Duration unit',
        is_able_disabled: 'true',
    },
    {
        id: 'base__duration-value',
        name: 'base__duration-value',
        field_name: 'quick-strategy__duration-value',
        input_value: 'input_duration_value',
        label: 'Duration value',
        placeholder: '5',
        trailing_icon_message: 'The trade length of your purchased contract.',
        ...common_inputs_properties,
    },
    {
        id: 'base__stake',
        name: 'base__stake',
        field_name: 'quick-strategy__stake',
        input_value: 'input_stake',
        label: 'Initial stake',
        placeholder: '10',
        trailing_icon_message: 'The amount that you pay to enter a trade.',
        ...common_inputs_properties,
    },
    {
        id: 'base__loss',
        name: 'base__loss',
        field_name: 'quick-strategy__loss',
        input_value: 'input_loss',
        label: 'Loss threshold',
        placeholder: '5000',
        trailing_icon_message: getMessage('loss'),
        ...common_inputs_properties,
    },
    {
        index: 0,
        id: 'martingale__size',
        name: 'martingale__size',
        field_name: 'martingale__size',
        input_value: 'input_size',
        label: 'Size',
        placeholder: '2',
        trailing_icon_message: quick_strategy_store.getSizeDesc(0),
        ...common_inputs_properties,
    },
    {
        index: 1,
        id: 'alembert-unit',
        name: 'alembert-unit',
        field_name: 'alembert-unit',
        input_value: 'input_alembert_unit',
        label: '',
        placeholder: '2',
        trailing_icon_message: quick_strategy_store.getSizeDesc(1),
        ...common_inputs_properties,
    },
    {
        index: 2,
        id: 'oscar-unit',
        name: 'oscar-unit',
        field_name: 'oscar-unit',
        input_value: 'input_oscar_unit',
        label: 'Units',
        placeholder: '2',
        trailing_icon_message: quick_strategy_store.getSizeDesc(2),
        ...common_inputs_properties,
    },
    {
        id: 'base__profit',
        name: 'base__profit',
        field_name: 'quick-strategy__profit',
        input_value: 'input_profit',
        label: 'Profit threshold',
        placeholder: '5000',
        trailing_icon_message: getMessage('profit'),
        ...common_inputs_properties,
    },
];

export default data_fields;
