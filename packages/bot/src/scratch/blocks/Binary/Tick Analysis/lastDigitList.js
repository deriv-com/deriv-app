import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.lastDigitList = {
    init() {
        this.jsonInit({
            message0       : translate('Last Digit List'),
            output         : 'Array',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Returns the list of last digit values'),
        });
    },
};

Blockly.JavaScript.lastDigitList = () => ['Bot.getLastDigitList()', Blockly.JavaScript.ORDER_ATOMIC];
