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
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
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

Blockly.Blocks.total_profit_string = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0       : translate('Total Profit String'),
            output         : 'String',
            outputShape    : Blockly.OUTPUT_SHAPE_SQUARE,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : translate('Returns the total profit in string format'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            'display_name': translate('Total Profit String'),
            'description' : translate('Total Profit String Description'),
        };
    },
};

Blockly.JavaScript.total_profit = () => ['Bot.getTotalProfit(false)', Blockly.JavaScript.ORDER_ATOMIC];
Blockly.JavaScript.total_profit_string = () => ['Bot.getTotalProfit(true)', Blockly.JavaScript.ORDER_ATOMIC];
