import { translate } from '../../../utils/lang/i18n';

Blockly.Blocks.text_length = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('length of %1'),
            args0   : [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Text Length Tooltip'),
            category       : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': translate('Text Length'),
            'description' : translate('Text Length Description'),
        };
    },
};

Blockly.JavaScript.text_length = block => {
    const text = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '\'\'';

    const code = `${text}.length`;
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};
