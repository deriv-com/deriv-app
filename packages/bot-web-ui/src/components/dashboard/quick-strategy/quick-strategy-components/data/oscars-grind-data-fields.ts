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

export const OSCARS_UNIT: TDataFields = {
    id: 'oscar_unit',
    field_name: 'oscar_unit',
    input_value: 'input_oscar_unit',
    label: localize('Units'),
    placeholder: '2',
    trailing_icon_message: 'The amount that you may add to your stake after each successful trade.',
    group_by: 'trade-type',
    type: INPUT_TYPES.NUMBER,
    className: 'quick-strategy__input',
    zIndex: popover_zindex.QUICK_STRATEGY,
};

const oscars_grind_data_fields = [
    TYPE_STRATEGY,
    {
        id: 'description',
        description: localize(
            "The Oscar's Grind Strategy is a low-risk positive progression strategy that first appeared in 1965. By using this strategy, the size of your contract will increase after successful trades, but remains unchanged after unsuccessful trades."
        ),
    },
    SYMBOL,
    TRADE_TYPE,
    DURATION_UNIT,
    DURATION_VALUE,
    STAKE,
    LOSS,
    OSCARS_UNIT,
    PROFIT,
];

export default oscars_grind_data_fields;
