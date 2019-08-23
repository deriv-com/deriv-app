import { translate } from '../../../utils/lang/i18n';

Blockly.Blocks.logic_boolean = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: '%1',
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'BOOL',
                    options: [[translate('true'), 'TRUE'], [translate('false'), 'FALSE']],
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_HEXAGONAL,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Logic Boolean Tooltip'),
            category       : Blockly.Categories.Logic,
        };
    },
    meta(){
        return {
            'display_name': translate('Logic Boolean'),
            'description' : translate('Logic Boolean Description'),
        };
    },
};

Blockly.JavaScript.logic_boolean = block => {
    const code = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
