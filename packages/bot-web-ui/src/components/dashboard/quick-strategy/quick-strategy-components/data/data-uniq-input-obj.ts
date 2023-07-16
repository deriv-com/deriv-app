import QuickStrategyStore from 'Stores/quick-strategy-store';
import RootStore from 'Stores/root-store';
import { TInputUniqFields } from '../../quick-strategy.types';
import common_inputs_properties, { TCommonInputsProperties } from './common-input-properties';

const quick_strategy_store = new QuickStrategyStore(RootStore);

export type TDataUniqInput = {
    id: TFieldNameUniqInput;
    field_name: TFieldNameUniqInput;
    input_value: TInputUniqFields;
    label: TFieldNameUniqLabel;
    placeholder: string;
    trailing_icon_message: string;
} & Readonly<TCommonInputsProperties>;

type TFieldNameUniqInput = 'martingale-size' | 'alembert-unit' | 'oscar-unit';
type TFieldNameUniqLabel = 'Size' | '' | 'Units';

const data_uniq_input_obj: ReadonlyArray<TDataUniqInput> = [
    {
        id: 'martingale-size',
        field_name: 'martingale-size',
        input_value: 'input_martingale_size',
        label: 'Size',
        placeholder: '2',
        trailing_icon_message: quick_strategy_store.getSizeDesc(0),
        ...common_inputs_properties,
    },
    {
        id: 'alembert-unit',
        field_name: 'alembert-unit',
        input_value: 'input_alembert_unit',
        label: 'Units',
        placeholder: '2',
        trailing_icon_message: quick_strategy_store.getSizeDesc(1),
        ...common_inputs_properties,
    },
    {
        id: 'oscar-unit',
        field_name: 'oscar-unit',
        input_value: 'input_oscar_unit',
        label: 'Units',
        placeholder: '2',
        trailing_icon_message: quick_strategy_store.getSizeDesc(2),
        ...common_inputs_properties,
    },
];

export default data_uniq_input_obj;
