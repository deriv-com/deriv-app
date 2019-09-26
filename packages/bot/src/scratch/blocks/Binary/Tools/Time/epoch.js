import { translate } from '../../../../../utils/lang/i18n';

Blockly.Blocks.epoch = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : translate('Seconds Since Epoch'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('Returns the number of seconds since January 1st, 1970'),
            category       : Blockly.Categories.Time,
        };
    },
    meta(){
        return {
            'display_name': translate('Second Since Epoch'),
            'description' : translate('This block returns the number of seconds since January 1st, 1970.'),
        };
    },
};

Blockly.JavaScript.epoch = () => ['Bot.getTime()', Blockly.JavaScript.ORDER_ATOMIC];
