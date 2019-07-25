import { translate } from '../../utils/lang/i18n';

/**
 * ENUM for categories.
 * @const
 */
Blockly.Categories = {
    'Trade_Definition': translate('trade_parameters'),
    'Before_Purchase' : translate('purchase_conditions'),
    'During_Purchase' : translate('sell_conditions'),
    'After_Purchase'  : translate('trade_results'),
    'Mathematical'    : translate('mathematical'),
    'Logic'           : translate('logic'),
    'Text'            : translate('text'),
    'Variables'       : translate('variable'),
    'Functions'       : translate('functions'),
    'List'            : translate('list'),
    'Indicators'      : translate('indicators'),
    'Time'            : translate('time'),
    'Tick_Analysis'   : translate('technical_analysis'),
    'Candle'          : translate('candle'),
    'Miscellaneous'   : translate('miscellaneous'),
};
