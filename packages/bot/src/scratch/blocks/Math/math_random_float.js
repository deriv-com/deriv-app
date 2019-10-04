import { translate } from '../../../utils/lang/i18n';

Blockly.Blocks.math_random_float = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('random fraction'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('Random fraction number'),
            category       : Blockly.Categories.Mathematical,
        };
    },
    meta(){
        return {
            'display_name': translate('Random fraction number'),
            'description' : translate('Returns a random fraction from 0.0 to 1.0'),
        };
    },
};

Blockly.JavaScript.math_random_float = () => ['Math.random()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
