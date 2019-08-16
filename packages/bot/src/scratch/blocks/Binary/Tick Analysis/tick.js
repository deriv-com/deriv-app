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

Blockly.JavaScript.tick = () => ['Bot.getLastTick()', Blockly.JavaScript.ORDER_ATOMIC];
