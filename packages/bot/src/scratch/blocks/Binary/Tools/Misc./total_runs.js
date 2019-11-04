import { localize } from 'deriv-translations/lib/translate';

Blockly.Blocks.total_runs = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : localize('Number of Runs'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Returns the number of runs'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta(){
        return {
            'display_name': localize('Number of Runs'),
            'description' : localize('This block returns the number of runsd since counters has been reset. You can reset counters by presising "Clear stats" on in the Transaction Stats panel or by refreshing a page in your browser.'),
        };
    },
};

Blockly.JavaScript.total_runs = () => ['Bot.getTotalRuns()', Blockly.JavaScript.ORDER_ATOMIC];
