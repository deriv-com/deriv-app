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
    'Mathematical'    : translate('math'),
    'Logic'           : translate('logic'),
    'Text'            : translate('text'),
    'Variables'       : translate('variables'),
    'Functions'       : translate('custom_functions'),
    'List'            : translate('lists'),
    'Indicators'      : translate('indicators'),
    'Time'            : translate('time'),
    'Tick_Analysis'   : translate('technical_analysis'),
    'Candle'          : translate('candle'),
    'Miscellaneous'   : translate('miscellaneous'),
    'Loop'            : translate('loops'),
};
/**
 * Number of pixels the mouse must move before a drag starts.
 */
Blockly.DRAG_RADIUS = 3;

/**
 * Number of pixels the mouse must move before a drag/scroll starts from the
 * flyout.  Because the drag-intention is determined when this is reached, it is
 * larger than Blockly.DRAG_RADIUS so that the drag-direction is clearer.
 */
Blockly.FLYOUT_DRAG_RADIUS = 1;
