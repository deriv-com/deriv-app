import { localize } from 'deriv-translations';

/**
 * ENUM for categories.
 * @const
 */
Blockly.Categories = {
    'Trade_Definition': localize('trade_parameters'),
    'Before_Purchase' : localize('purchase_conditions'),
    'During_Purchase' : localize('sell_conditions'),
    'After_Purchase'  : localize('trade_results'),
    'Mathematical'    : localize('math'),
    'Logic'           : localize('logic'),
    'Text'            : localize('text'),
    'Variables'       : localize('variables'),
    'Functions'       : localize('custom_functions'),
    'List'            : localize('lists'),
    'Indicators'      : localize('indicators'),
    'Time'            : localize('time'),
    'Tick_Analysis'   : localize('technical_analysis'),
    'Candle'          : localize('candle'),
    'Miscellaneous'   : localize('miscellaneous'),
    'Loop'            : localize('loops'),
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
