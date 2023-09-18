import { localize } from '@deriv/translations';
import { INPUT_TYPES } from 'Constants/quick-strategies-validation';
import { popover_zindex } from 'Constants/z-indexes';
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

export const MARTINGALE_SIZE: TDataFields = {
    id: 'size',
    field_name: 'size',
    input_value: 'input_martingale_size',
    label: localize('Size'),
    placeholder: '2',
    trailing_icon_message:
        'The multiplier amount used to increase your stake if you’re losing a trade. Value must be higher than 2.',
    group_by: 'trade-type',
    type: INPUT_TYPES.NUMBER,
    className: 'quick-strategy__input',
    zIndex: popover_zindex.QUICK_STRATEGY,
};

const martingale_data_fields = [
    TYPE_STRATEGY,
    {
        id: 'description',
        description: localize(
            'The Martingale Strategy is a classic trading technique that has been used for more than a hundred years, popularised by the French mathematician Paul Pierre Levy in the 18th century.'
        ),
    },
    SYMBOL,
    TRADE_TYPE,
    DURATION_UNIT,
    DURATION_VALUE,
    STAKE,
    LOSS,
    MARTINGALE_SIZE,
    PROFIT,
];

export default martingale_data_fields;
