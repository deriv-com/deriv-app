import { localize } from 'deriv-translations';

Blockly.Blocks.text_isEmpty = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('text %1 is empty'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'VALUE',
                    check: ['String'],
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Tests if a given text string is empty'),
            category       : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': localize('Text Is empty'),
            'description' : localize('Tests whether a string of text is empty. Returns a boolean value (true or false).'),
        };
    },
};

Blockly.JavaScript.text_isEmpty = block => {
    const text = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
    const isVariable = block.workspace.getAllVariables().findIndex(variable => variable.name === text) !== -1;

    const code = isVariable ? `!${text} || !${text}.length` : `!${text}.length`;
    return [code, Blockly.JavaScript.ORDER_LOGICAL_NOT];
};
