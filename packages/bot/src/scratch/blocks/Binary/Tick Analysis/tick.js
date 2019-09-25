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
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Returns the tick value received by a before purchase block'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': translate('Tick value'),
            'description' : translate('Tick value Description'),
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
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
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
