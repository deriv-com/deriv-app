import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.tick = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('Last Tick'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : translate('Returns the tick value received from server'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': translate('Last tick'),
            'description' : translate('This block returns the last tick value for the selected Market. You can select Market in the root block “Trade parameters”.'),
        };
    },
};

Blockly.Blocks.tick_string = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0       : translate('Last Tick String'),
            output         : 'String',
            outputShape    : Blockly.OUTPUT_SHAPE_SQUARE,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : translate('Returns the tick value received by a before purchase block in string format'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': translate('Tick value'),
            'description' : translate('Tick value Description'),
        };
    },
    onchange: Blockly.Blocks.tick.onchange,
};

Blockly.JavaScript.tick = () => ['Bot.getLastTick(false, false)', Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.tick_string = () => ['Bot.getLastTick(false, true)', Blockly.JavaScript.ORDER_ATOMIC];
