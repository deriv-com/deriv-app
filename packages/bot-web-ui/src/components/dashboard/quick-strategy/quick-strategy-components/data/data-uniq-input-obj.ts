import { localize } from '@deriv/translations';
import { TDataFields } from '../../quick-strategy.types';
import common_inputs_properties from './common-input-properties';

export const MARTINGALE_SIZE: TDataFields = {
    id: 'martingale-size',
    field_name: 'martingale-size',
    input_value: 'input_martingale_size',
    label: localize('Size'),
    placeholder: '2',
    trailing_icon_message:
        'The multiplier amount used to increase your stake if you’re losing a trade. Value must be higher than 2.',
    group_by: 'strategy',
    ...common_inputs_properties,
};

export const ALEMBERT_UNIT: TDataFields = {
    id: 'alembert-unit',
    field_name: 'alembert-unit',
    input_value: 'input_alembert_unit',
    label: localize('Units'),
    placeholder: '2',
    trailing_icon_message: 'The amount that you may add to your stake if you’re losing a trade.',
    group_by: 'strategy',
    ...common_inputs_properties,
};

export const OSCARS_UNIT: TDataFields = {
    id: 'oscar-unit',
    field_name: 'oscar-unit',
    input_value: 'input_oscar_unit',
    label: localize('Units'),
    placeholder: '2',
    trailing_icon_message: 'The amount that you may add to your stake after each successful trade.',
    group_by: 'strategy',
    ...common_inputs_properties,
};
