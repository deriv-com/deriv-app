import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.total_runs = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('Number of Runs'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('Returns the number of runs'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta(){
        return {
            'display_name': translate('Number of Runs'),
            'description' : translate('This block returns the number of runsd since counters has been reset. You can reset counters by presising "Clear stats" on in the Transaction Stats panel or by refreshing a page in your browser.'),
        };
    },
};

Blockly.JavaScript.total_runs = () => ['Bot.getTotalRuns()', Blockly.JavaScript.ORDER_ATOMIC];
