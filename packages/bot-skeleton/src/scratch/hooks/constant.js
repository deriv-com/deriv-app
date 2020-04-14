/**
 * ENUM for categories.
 * @const
 */
Blockly.Categories = {
    Trade_Definition: 'trade_parameters',
    Before_Purchase: 'purchase_conditions',
    During_Purchase: 'sell_conditions',
    After_Purchase: 'trade_results',
    Mathematical: 'math',
    Logic: 'logic',
    Text: 'text',
    Variables: 'variables',
    Functions: 'custom_functions',
    List: 'lists',
    Indicators: 'indicators',
    Time: 'time',
    Tick_Analysis: 'technical_analysis',
    Candle: 'candle',
    Miscellaneous: 'miscellaneous',
    Loop: 'loops',
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
