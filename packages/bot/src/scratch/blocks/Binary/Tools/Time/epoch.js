import { localize } from 'deriv-translations';

Blockly.Blocks.epoch = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : localize('Seconds Since Epoch'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Returns the number of seconds since January 1st, 1970'),
            category       : Blockly.Categories.Time,
        };
    },
    meta(){
        return {
            'display_name': localize('Second Since Epoch'),
            'description' : localize('This block returns the number of seconds since January 1st, 1970.'),
        };
    },
};

Blockly.JavaScript.epoch = () => ['Bot.getTime()', Blockly.JavaScript.ORDER_ATOMIC];
