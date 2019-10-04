import { translate } from '../../../utils/tools';

Blockly.Blocks.logic_null = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : 'null',
            output         : null,
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('Returns the "null" value'),
            category       : Blockly.Categories.Logic,
        };
    },
    meta(){
        return {
            'display_name': translate('Null'),
            'description' : translate('This is used to assign a null value to an item or statement.'),
        };
    },
};
Blockly.JavaScript.logic_null = () => ['null', Blockly.JavaScript.ORDER_ATOMIC];
