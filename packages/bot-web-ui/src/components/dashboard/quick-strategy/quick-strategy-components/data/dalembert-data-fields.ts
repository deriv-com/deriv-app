import { localize } from '@deriv/translations';
import { INPUT_TYPES } from 'Constants/quick-strategies-validation';
import { TDataFields } from '../../quick-strategy.types';
import {
    DURATION_UNIT,
    DURATION_VALUE,
    LOSS,
    PROFIT,
    STAKE,
    SYMBOL,
    TRADE_TYPE,
    TYPE_STRATEGY,
} from './common-data-fields';

export const ALEMBERT_UNIT: TDataFields = {
    id: 'alembert_unit',
    field_name: 'alembert_unit',
    input_value: 'input_alembert_unit',
    label: localize('Units'),
    placeholder: '2',
    trailing_icon_message: 'The amount that you may add to your stake if you’re losing a trade.',
    group_by: 'trade-type',
    type: INPUT_TYPES.NUMBER,
    className: 'quick-strategy__input',
};

export const DALEMBERT_DESCRIPTION: TDataFields = {
    id: 'description',
    description: localize(
        'The concept of the D’Alembert Strategy is said to be similar to the Martingale Strategy where you will increase your contract size after a loss. With the D’Alembert Strategy, you will also decrease your contract size after a successful trade.'
    ),
};

const dalembert_data_fields = [
    TYPE_STRATEGY,
    DALEMBERT_DESCRIPTION,
    SYMBOL,
    TRADE_TYPE,
    DURATION_UNIT,
    DURATION_VALUE,
    STAKE,
    LOSS,
    ALEMBERT_UNIT,
    PROFIT,
];

export default dalembert_data_fields;
