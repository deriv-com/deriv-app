import { localize } from 'deriv-translations';

Blockly.Blocks.lastDigitList = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : localize('Last digits list'),
            output         : 'Array',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Returns the list of last digits of 1000 recent tick values'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': localize('Last Digits List'),
            'description' : localize('This block gives you a list of the last digits of the last 1000 tick values.'),
        };
    },
};

Blockly.JavaScript.lastDigitList = () => ['Bot.getLastDigitList()', Blockly.JavaScript.ORDER_ATOMIC];
