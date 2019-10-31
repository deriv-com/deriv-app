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
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : translate('This block gives you a random fraction between 0.0 to 1.0'),
            category       : Blockly.Categories.Mathematical,
        };
    },
    meta(){
        return {
            'display_name': translate('Random fraction number'),
            'description' : translate('This block gives you a random fraction between 0.0 to 1.0.'),
        };
    },
};

Blockly.JavaScript.math_random_float = () => ['Math.random()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
