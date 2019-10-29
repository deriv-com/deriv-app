import { localize } from 'deriv-translations/src/i18next/i18n';

Blockly.Blocks.logic_null = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : 'null',
            output         : null,
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Returns the "null" value'),
            category       : Blockly.Categories.Logic,
        };
    },
    meta(){
        return {
            'display_name': localize('Null'),
            'description' : localize('This is used to assign a null value to an item or statement.'),
        };
    },
};
Blockly.JavaScript.logic_null = () => ['null', Blockly.JavaScript.ORDER_ATOMIC];
