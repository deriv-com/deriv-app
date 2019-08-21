import { translate } from '../../../utils/lang/i18n';

Blockly.Blocks.text_isEmpty = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('text %1 is empty'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'VALUE',
                    check: ['String'],
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_HEXAGONAL,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Text Is empty'),
            category       : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': translate('Text Is empty'),
            'description' : translate('Text Is empty'),
        };
    },
};

Blockly.JavaScript.text_isEmpty = block => {
    const text = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
    const isVariable = block.workspace.getAllVariables().findIndex(variable => variable.name === text) !== -1;

    const code = isVariable ? `!${text} || !${text}.length` : `!${text}.length`;
    return [code, Blockly.JavaScript.ORDER_LOGICAL_NOT];
};
