import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.total_profit = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('Total Profit/Loss'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('Returns the total profit/loss'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta(){
        return {
            'display_name': translate('Total Profit'),
            'description' : translate('This block returns the total profit/loss since counters has been reset. You can reset counters by presising "Clear stats" on in the Transaction Stats panel or by refreshing a page in your browser.'),
        };
    },
};

Blockly.JavaScript.total_profit = () => ['Bot.getTotalProfit()', Blockly.JavaScript.ORDER_ATOMIC];
