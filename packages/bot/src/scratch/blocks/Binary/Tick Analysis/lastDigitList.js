import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.lastDigitList = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('Last Digits List'),
            output         : 'Array',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Analysis.colour,
            colourSecondary: Blockly.Colours.Analysis.colourSecondary,
            colourTertiary : Blockly.Colours.Analysis.colourTertiary,
            tooltip        : translate('Returns the list of last digits of 1000 recent tick values'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': translate('Last Digits List'),
            'description' : translate('Returns the list of last digits of 1000 recent tick values'),
        };
    },
};

Blockly.JavaScript.lastDigitList = () => ['Bot.getLastDigitList()', Blockly.JavaScript.ORDER_ATOMIC];
