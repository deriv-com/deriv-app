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
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Returns the list of tick values'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            'display_name': translate('Tick List'),
            'description' : translate('Tick List Description'),
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
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
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
