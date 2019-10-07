import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.ticks = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('Ticks List'),
            output         : 'Array',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : translate('Returns the list of 1000 recent tick values'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            'display_name': translate('Tick List'),
            'description' : translate('This block returns the list of 1000 recent tick values for the market selected in the Trade Parameters.'),
        };
    },
};

Blockly.Blocks.ticks_string = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0       : translate('Ticks String List'),
            output         : 'Array',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : translate('Returns the list of tick values in string format'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            'display_name': translate('Tick List String'),
            'description' : translate('Tick List String Description'),
        };
    },
    onchange: Blockly.Blocks.ticks.onchange,
};

Blockly.JavaScript.ticks = () => ['Bot.getTicks(false)', Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.ticks_string = () => ['Bot.getTicks(true)', Blockly.JavaScript.ORDER_ATOMIC];
