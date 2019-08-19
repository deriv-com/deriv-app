import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.last_digit = {
    init() {
        this.jsonInit({
            message0       : translate('Last Digit'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Returns the last digit of the latest tick'),
        });
    },
};

Blockly.JavaScript.last_digit = () => ['Bot.getLastDigit()', Blockly.JavaScript.ORDER_ATOMIC];
