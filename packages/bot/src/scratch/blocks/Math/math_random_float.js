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
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Math Random Float Tooltip'),
            category       : Blockly.Categories.Mathematical,
        };
    },
    meta(){
        return {
            'display_name': translate('Math Random Float'),
            'description' : translate('Math Random Float Description'),
        };
    },
};

Blockly.JavaScript.math_random_float = () => ['Math.random()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
