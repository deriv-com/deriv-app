import { translate } from '../../../utils/lang/i18n';

Blockly.Blocks.logic_negate = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('not %1'),
            args0   : [
                {
                    type: 'input_value',
                    name: 'BOOL',
                },
            ],
            output         : 'Boolean',
            outputShape    : Blockly.OUTPUT_SHAPE_HEXAGONAL,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
            tooltip        : translate('Logic Negate Tooltip'),
            category       : Blockly.Categories.Logic,
        };
    },
    meta(){
        return {
            'display_name': translate('Logic Negate'),
            'description' : translate('Logic Negate Description'),
        };
    },
};

Blockly.JavaScript.logic_negate = block => {
    const order = Blockly.JavaScript.ORDER_LOGICAL_NOT;
    const argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL', order) || 'true';

    const code = `!${argument0}`;
    return [code, order];
};
