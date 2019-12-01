import { localize } from 'deriv-translations';

Blockly.Blocks.math_modulo = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('remainder of %1 ÷ %2'),
            args0   : [
                {
                    type : 'input_value',
                    name : 'DIVIDEND',
                    check: 'Number',
                },
                {
                    type : 'input_value',
                    name : 'DIVISOR',
                    check: 'Number',
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Returns the remainder after a division'),
            category       : Blockly.Categories.Mathematical,
        };
    },
    meta(){
        return {
            'display_name': localize('Remainder after division'),
            'description' : localize(' Returns the remainder after the division of the given numbers.'),
        };
    },
};

Blockly.JavaScript.math_modulo = block => {
    const argument0 = Blockly.JavaScript.valueToCode(block, 'DIVIDEND', Blockly.JavaScript.ORDER_MODULUS) || '0';
    const argument1 = Blockly.JavaScript.valueToCode(block, 'DIVISOR', Blockly.JavaScript.ORDER_MODULUS) || '0';

    const code = `${argument0} % ${argument1}`;
    return [code, Blockly.JavaScript.ORDER_MODULUS];
};
