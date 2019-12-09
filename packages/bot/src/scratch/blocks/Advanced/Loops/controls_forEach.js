import { localize } from 'deriv-translations';

Blockly.Blocks.controls_forEach = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('for each item %1 in list %2'),
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VAR',
                    variable: null,
                },
                {
                    type : 'input_value',
                    name : 'LIST',
                    check: 'Array',
                },
            ],
            message1: localize('do %1'),
            args1   : [
                {
                    type: 'input_statement',
                    name: 'DO',
                },
            ],
            colour           : Blockly.Colours.Base.colour,
            colourSecondary  : Blockly.Colours.Base.colourSecondary,
            colourTertiary   : Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : localize('Iterates through a given list'),
            category         : Blockly.Categories.Loop,
        };
    },
    meta(){
        return {
            'display_name': localize('Iterate (2)'),
            'description' : localize('This block uses the variable "i" to control the iterations. With each iteration, the value of "i" is determined by the items in a given list.'),
        };
    },
};

Blockly.JavaScript.controls_forEach = block => {
    // eslint-disable-next-line no-underscore-dangle
    const variable0 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    const argument0 = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ASSIGNMENT) || '[]';

    let branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block.id);

    let code = '';

    // Cache non-trivial values to variables to prevent repeated look-ups.
    let listVar = argument0;
    if (!argument0.match(/^\w+$/)) {
        // eslint-disable-next-line no-underscore-dangle
        listVar = Blockly.JavaScript.variableDB_.getDistinctName(`${variable0}_list`, Blockly.Variables.NAME_TYPE);
        code = `var ${listVar} = ${argument0};\n`;
    }

    // eslint-disable-next-line no-underscore-dangle
    const indexVar = Blockly.JavaScript.variableDB_.getDistinctName(`${variable0}_list`, Blockly.Variables.NAME_TYPE);

    code += `
    for (var ${indexVar} in ${listVar}) {
        ${variable0} = ${listVar}[${indexVar}];
        ${branch}
    }\n`;

    return code;
};
