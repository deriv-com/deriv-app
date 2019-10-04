import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.lists_length = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('length of %1'),
            args0   : [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('Returns the total number of items in a given list'),
            category       : Blockly.Categories.List,
        };
    },
    meta(){
        return {
            'display_name': translate('List Length'),
            'description' : translate('Returns the total number of items in a given list.'),
        };
    },
};

Blockly.JavaScript.lists_length = block => {
    const list = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER) || '[]';

    const code = `${list}.length`;
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};
