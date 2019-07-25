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
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Returns the number of runs since the beginning'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta(){
        return {
            'display_name': translate('Total Runs'),
            'description' : translate('Total Runs Description'),
        };
    },
};

Blockly.JavaScript.total_runs = () => ['Bot.getTotalRuns()', Blockly.JavaScript.ORDER_ATOMIC];
