import { translate } from '../../../utils/lang/i18n';

Blockly.Blocks.math_constrain = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('constrain %1 low %2 high %3'),
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
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('Constraints a given number to be within a set range'),
            category       : Blockly.Categories.Mathematical,
        };
    },
    meta(){
        return {
            'display_name': translate('Constrain within a range'),
            'description' : translate('Constraints a given number to be within a set range.'),
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
