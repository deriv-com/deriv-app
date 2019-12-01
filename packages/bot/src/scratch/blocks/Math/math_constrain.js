import { localize }  from 'deriv-translations';

Blockly.Blocks.math_constrain = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('constrain %1 low %2 high %3'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'VALUE',
                    check: 'Number',
                },
                {
                    type : 'input_value',
                    name : 'LOW',
                    check: 'Number',
                },
                {
                    type : 'input_value',
                    name : 'HIGH',
                    check: 'Number',
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('This block constrains a given number so that it is within a set range.'),
            category       : Blockly.Categories.Mathematical,
        };
    },
    meta(){
        return {
            'display_name': localize('Constrain within a range'),
            'description' : localize('This block constrains a given number so that it is within a set range.'),
        };
    },
};

Blockly.JavaScript.math_constrain = block => {
    const argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_COMMA) || '0';
    const argument1 = Blockly.JavaScript.valueToCode(block, 'LOW', Blockly.JavaScript.ORDER_COMMA) || '0';
    const argument2 = Blockly.JavaScript.valueToCode(block, 'HIGH', Blockly.JavaScript.ORDER_COMMA) || '0';

    const code = `Math.min(Math.max(${argument0}, ${argument1}), ${argument2})`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
