import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.ticks = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('Ticks List'),
            output         : 'Array',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Analysis.colour,
            colourSecondary: Blockly.Colours.Analysis.colourSecondary,
            colourTertiary : Blockly.Colours.Analysis.colourTertiary,
            tooltip        : translate('Returns the list of 1000 recent tick values'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': translate('Tick List'),
            'description' : translate('This block returns the list of 1000 recent tick values for the market selected in the Trade Parameters.'),
        };
    },
};

Blockly.JavaScript.ticks = () => ['Bot.getTicks()', Blockly.JavaScript.ORDER_ATOMIC];
