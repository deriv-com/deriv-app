import { localize } from 'deriv-translations';

Blockly.Blocks.logic_negate = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('not %1'),
            args0   : [
                {
                    type: 'input_value',
                    name: 'BOOL',
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Converts a given True of False to the oposite value'),
            category       : Blockly.Categories.Logic,
        };
    },
    meta(){
        return {
            'display_name': localize('Logic negate'),
            'description' : localize('This block converts the boolean value (true or false) to its opposite.'),
        };
    },
};

Blockly.JavaScript.logic_negate = block => {
    const order = Blockly.JavaScript.ORDER_LOGICAL_NOT;
    const argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL', order) || 'true';

    const code = `!${argument0}`;
    return [code, order];
};
