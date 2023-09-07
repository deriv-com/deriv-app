import { DURATION_UNIT, DURATION_VALUE, LOSS, PROFIT, STAKE, SYMBOL, TRADE_TYPE, TYPE_STRATEGY } from './data-fields';
import { MARTINGALE_SIZE } from './data-uniq-input-obj';

const martingale_data_fields = [
    TYPE_STRATEGY,
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
