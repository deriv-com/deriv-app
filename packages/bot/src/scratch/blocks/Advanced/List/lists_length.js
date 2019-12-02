import { localize } from 'deriv-translations';

Blockly.Blocks.lists_length = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('length of %1'),
            args0   : [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('This block gives you the total number of items in a given list.'),
            category       : Blockly.Categories.List,
        };
    },
    meta(){
        return {
            'display_name': localize('List Length'),
            'description' : localize('This block gives you the total number of items in a given list.'),
        };
    },
};

Blockly.JavaScript.lists_length = block => {
    const list = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER) || '[]';

    const code = `${list}.length`;
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};
