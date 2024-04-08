import { localize } from '@deriv/translations';

Blockly.Blocks.logic_null = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: 'null',
            output: null,
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block assigns a null value to an item or statement.'),
            category: Blockly.Categories.Logic,
        };
    },
    meta() {
        return {
            display_name: localize('Null'),
            description: localize('This block assigns a null value to an item or statement.'),
        };
    },
};
Blockly.JavaScript.javascriptGenerator.forBlock['logic_null'] = () => ['null', Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
