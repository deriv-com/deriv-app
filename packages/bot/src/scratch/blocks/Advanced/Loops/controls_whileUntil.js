import { localize } from 'deriv-translations';

Blockly.Blocks.controls_whileUntil = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('repeat %1 %2'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'MODE',
                    options: [[localize('while'), 'WHILE'], [localize('until'), 'UNTIL']],
                },
                {
                    type : 'input_value',
                    name : 'BOOL',
                    check: 'Boolean',
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
            tooltip          : localize('This block repeats instructions as long as a given condition is true'),
            category         : Blockly.Categories.Loop,
        };
    },
    meta(){
        return {
            'display_name': localize('Repeat While/Until'),
            'description' : localize('This block repeats instructions as long as a given condition is true.'),
        };
    },
};

Blockly.JavaScript.controls_whileUntil = block => {
    const branch = Blockly.JavaScript.statementToCode(block, 'DO');
    const until = block.getFieldValue('MODE') === 'UNTIL';
    const order = until ? Blockly.JavaScript.ORDER_LOGICAL_NOT : Blockly.JavaScript.ORDER_NONE;
    let argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL', order) || 'false';

    if (until) {
        argument0 = `!${argument0}`;
    }

    // eslint-disable-next-line no-underscore-dangle
    const maxLoopVar = Blockly.JavaScript.variableDB_.getDistinctName('maxLoops', Blockly.Variables.NAME_TYPE);
    // eslint-disable-next-line no-underscore-dangle
    const currentLoopVar = Blockly.JavaScript.variableDB_.getDistinctName('currentLoop', Blockly.Variables.NAME_TYPE);

    return `
        var ${maxLoopVar} = 10000;
        var ${currentLoopVar} = 0;

        while (${argument0}) {
            if (${currentLoopVar} > ${maxLoopVar}) {
                throw new Error("${localize('Infinite loop detected')}");
            } else {
                ${currentLoopVar}++;
            }
            
            ${branch}
        }\n`;
};
