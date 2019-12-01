import { localize } from 'deriv-translations';

Blockly.Blocks.variables_set = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            type    : 'field_variable',
            message0: localize('set %1 to %2'),
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VAR',
                    variable: localize('item'),
                },
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            colour           : Blockly.Colours.Special2.colour,
            colourSecondary  : Blockly.Colours.Special2.colourSecondary,
            colourTertiary   : Blockly.Colours.Special2.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : localize('Sets variable value'),
            category         : Blockly.Categories.Variables,
        };
    },
    meta(){
        return {
            'display_name': localize('Set variable'),
            'description' : localize('Assigns a given value to a variable'),
        };
    },
};

Blockly.JavaScript.variables_set = block => {
    const argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    // eslint-disable-next-line no-underscore-dangle
    const varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

    const code = `${varName} = ${argument0};\n`;
    return code;
};
