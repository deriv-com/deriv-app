import { localize } from 'deriv-translations';

Blockly.Blocks.tick = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : localize('Last Tick'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Returns the tick value received from server'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': localize('Last tick'),
            'description' : localize('This block gives you the value of the last tick.'),
        };
    },
};

Blockly.Blocks.tick_string = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0       : localize('Last Tick String'),
            output         : 'String',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Returns the tick value received by a before purchase block in string format'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': localize('Tick value'),
            'description' : localize('Tick value Description'),
        };
    },
    onchange: Blockly.Blocks.tick.onchange,
};

Blockly.JavaScript.tick = () => ['Bot.getLastTick(false, false)', Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.tick_string = () => ['Bot.getLastTick(false, true)', Blockly.JavaScript.ORDER_ATOMIC];
