import { localize } from 'deriv-translations';

Blockly.Blocks.logic_ternary = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('test %1'),
            message1: localize('if true %1'),
            message2: localize('if false %1'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'IF',
                    check: 'Boolean',
                },
            ],
            args1: [
                {
                    type: 'input_value',
                    name: 'THEN',
                },
            ],
            args2: [
                {
                    type: 'input_value',
                    name: 'ELSE',
                },
            ],
            output         : null,
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('This block tests if a given value is true or false and returns “True” or “False” accordingly.'),
            category       : Blockly.Categories.Logic,
        };
    },
    meta(){
        return {
            'display_name': localize('Test value'),
            'description' : localize('This block tests if a given value is true or false and returns “True” or “False” accordingly.'),
        };
    },
};

Blockly.JavaScript.logic_ternary = block => {
    const valueIf = Blockly.JavaScript.valueToCode(block, 'IF', Blockly.JavaScript.ORDER_CONDITIONAL) || 'false';
    const valueThen = Blockly.JavaScript.valueToCode(block, 'THEN', Blockly.JavaScript.ORDER_CONDITIONAL) || 'null';
    const valueElse = Blockly.JavaScript.valueToCode(block, 'ELSE', Blockly.JavaScript.ORDER_CONDITIONAL) || 'null';

    const code = `(${valueIf} ? ${valueThen} : ${valueElse})`;
    return [code, Blockly.JavaScript.ORDER_CONDITIONAL];
};
