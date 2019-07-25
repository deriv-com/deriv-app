import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.total_profit = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('Total Profit'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Returns the total profit'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta(){
        return {
            'display_name': translate('Total Profit'),
            'description' : translate('Total Profit Description'),
        };
    },
};

Blockly.JavaScript.total_profit = () => ['Bot.getTotalProfit()', Blockly.JavaScript.ORDER_ATOMIC];
