import { localize } from '@deriv/translations';

Blockly.Blocks.logic_negate = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('not {{ boolean }}', { boolean: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'BOOL',
                },
            ],
            output: 'Boolean',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Converts a given True or False to the opposite value'),
            category: Blockly.Categories.Logic,
        };
    },
    meta() {
        return {
            display_name: localize('Logic negation'),
            description: localize('This block converts the boolean value (true or false) to its opposite.'),
        };
    },
    getRequiredValueInputs() {
        return {
            BOOL: null,
        };
    },
};

Blockly.JavaScript.logic_negate = block => {
    const order = Blockly.JavaScript.ORDER_LOGICAL_NOT;
    const argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL', order) || 'true';

    const code = `!${argument0}`;
    return [code, order];
};
