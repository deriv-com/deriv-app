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
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('Text String Length'),
            category       : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': translate('Text String Length'),
            'description' : translate('Returns the number of characters of a given string of text, including numbers, spaces, punctuation marks, and symbols.'),
        };
    },
};

Blockly.JavaScript.text_length = block => {
    const text = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '\'\'';

    const code = `${text}.length`;
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};
