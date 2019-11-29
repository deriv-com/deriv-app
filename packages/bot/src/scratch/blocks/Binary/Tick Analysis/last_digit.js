import { localize } from 'deriv-translations';

Blockly.Blocks.last_digit = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : localize('Last Digit'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Returns the last digit of the latest tick'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': localize('Last Digit'),
            'description' : localize('This block gives you the last digit of the latest tick value.'),
        };
    },
};

Blockly.JavaScript.last_digit = () => ['Bot.getLastDigit()', Blockly.JavaScript.ORDER_ATOMIC];
