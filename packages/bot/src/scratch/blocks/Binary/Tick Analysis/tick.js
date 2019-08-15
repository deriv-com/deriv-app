import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.tick = {
    init() {
        this.jsonInit({
            message0       : translate('Last Tick'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Returns the tick value received by a before purchase block'),
        });
    },
};

Blockly.JavaScript.tick = () => ['Bot.getLastTick()', Blockly.JavaScript.ORDER_ATOMIC];
