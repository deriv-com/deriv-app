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
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Returns the list of tick values'),
            category       : Blockly.Categories.Tick_Analysis,
        };
    },
    meta(){
        return {
            'display_name': translate('Tick List'),
            'description' : translate('Tick List Description'),
        };
    },
};

Blockly.JavaScript.ticks = () => ['Bot.getTicks()', Blockly.JavaScript.ORDER_ATOMIC];
