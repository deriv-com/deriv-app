/* eslint import/no-webpack-loader-syntax: 0 */
const goog = require('imports-loader?goog=>Blockly!exports-loader?goog!scratch-blocks/blockly_compressed_vertical');
const Blockly = require('blockly');


Blockly.JavaScript = require('blockly/javascript');
const code = new Blockly.Generator('code');

Blockly.JavaScript = {
    ...Blockly.JavaScript,
    ...code
}

Blockly.Colours = {}

window.goog = goog;
window.Blockly = Blockly;


require('imports-loader!scratch-blocks/msg/messages');


require('./blocks');
require('./hooks');

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

Blockly.Workspace.prototype.getAllFields = function (is_ordered) {
    return this.getAllBlocks(is_ordered).reduce((fields, block) => {
        block.inputList.forEach(input => fields.push(...input.fieldRow));
        return fields;
    }, []);
};
Blockly.Block.prototype.isDescendantOf = function (type) {
    let parentBlock = this.getParent();
    while (parentBlock !== null) {
        if (parentBlock.type === type) {
            return true;
        }
        parentBlock = parentBlock.getParent();
    }
    return false;
};

Blockly.Themes.haba = Blockly.Theme.defineTheme('haba', {
    'base': Blockly.Themes.Classic,
    'componentStyles': {
       
    }
});



