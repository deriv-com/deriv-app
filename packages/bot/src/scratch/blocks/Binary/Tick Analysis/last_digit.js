import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.last_digit = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('Last Digit'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Returns the last digit of the latest tick'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': translate('Last Digit'),
            'description' : translate('Last Digit Description'),
        };
    },
};

Blockly.JavaScript.last_digit = () => ['Bot.getLastDigit()', Blockly.JavaScript.ORDER_ATOMIC];
