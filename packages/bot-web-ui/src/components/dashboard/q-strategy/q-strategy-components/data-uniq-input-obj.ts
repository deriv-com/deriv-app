import QuickStrategyStore from 'Stores/quick-strategy-store';
import common_inputs_properties from './common-input-properties';

const quick_strategy_store = new QuickStrategyStore();

const data_uniq_input_obj: Array<any> = [
    Object.freeze({
        index: 0,
        id: 'martingale__size',
        name: 'martingale__size',
        field_name: 'martingale__size',
        input_value: 'input_martingale_size',
        label: 'Size',
        placeholder: '2',
        trailing_icon_message: quick_strategy_store.getSizeDesc(0),
        ...common_inputs_properties,
    }),
    Object.freeze({
        index: 1,
        id: 'alembert-unit',
        name: 'alembert-unit',
        field_name: 'alembert-unit',
        input_value: 'input_alembert_unit',
        label: '',
        placeholder: '2',
        trailing_icon_message: quick_strategy_store.getSizeDesc(1),
        ...common_inputs_properties,
    }),
    Object.freeze({
        index: 2,
        id: 'oscar-unit',
        name: 'oscar-unit',
        field_name: 'oscar-unit',
        input_value: 'input_oscar_unit',
        label: 'Units',
        placeholder: '2',
        trailing_icon_message: quick_strategy_store.getSizeDesc(2),
        ...common_inputs_properties,
    }),
];

export default data_uniq_input_obj;
