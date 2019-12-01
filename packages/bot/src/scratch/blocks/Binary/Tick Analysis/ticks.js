import { localize }  from 'deriv-translations';

Blockly.Blocks.ticks = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : localize('Ticks list'),
            output         : 'Array',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('This block gives you a list of the last 1000 tick values.'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            'display_name': localize('Tick list'),
            'description' : localize('This block gives you a list of the last 1000 tick values.'),
        };
    },
};

Blockly.Blocks.ticks_string = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0       : localize('Ticks String List'),
            output         : 'Array',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Returns the list of tick values in string format'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            'display_name': localize('Tick List String'),
            'description' : localize('Tick List String Description'),
        };
    },
    onchange: Blockly.Blocks.ticks.onchange,
};

Blockly.JavaScript.ticks = () => ['Bot.getTicks(false)', Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.ticks_string = () => ['Bot.getTicks(true)', Blockly.JavaScript.ORDER_ATOMIC];
