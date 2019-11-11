import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.total_runs = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('Number of runs'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : translate('Returns the number of runs'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta(){
        return {
            'display_name': translate('Number of runs'),
            'description' : translate('This block gives you the total number of times your bot has run. You can reset this by clicking “Clear stats” on the Transaction Stats window, or by refreshing this page in your browser.'),
        };
    },
    onchange: Blockly.Blocks.total_profit.onchange,
};

Blockly.JavaScript.total_runs = () => ['Bot.getTotalRuns()', Blockly.JavaScript.ORDER_ATOMIC];
