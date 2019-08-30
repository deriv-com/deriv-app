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
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Returns the epoch time (seconds since epoch)'),
            category       : Blockly.Categories.Time,
        };
    },
    meta(){
        return {
            'display_name': translate('Second Since Epoch'),
            'description' : translate('Seconds Since Epoch Decription'),
        };
    },
};

Blockly.JavaScript.epoch = () => ['Bot.getTime()', Blockly.JavaScript.ORDER_ATOMIC];
