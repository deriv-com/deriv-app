import { localize } from 'deriv-translations';

Blockly.Blocks.lists_indexOf = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('in list %1 find %2 occurence of item %3'),
            args0   : [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
                {
                    type   : 'field_dropdown',
                    name   : 'END',
                    options: [[localize('first'), 'FIRST'], [localize('last'), 'LAST']],
                },
                {
                    type: 'input_value',
                    name: 'FIND',
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('This block gives you the position of an item in a given list.'),
            category       : Blockly.Categories.List,
        };
    },
    meta(){
        return {
            'display_name': localize('List item position'),
            'description' : localize('This block gives you the position of an item in a given list.'),
        };
    },
};

Blockly.JavaScript.lists_indexOf = block => {
    const operator = block.getFieldValue('END') === 'FIRST' ? 'indexOf' : 'lastIndexOf';
    const item = Blockly.JavaScript.valueToCode(block, 'FIND', Blockly.JavaScript.ORDER_NONE) || '\'\'';
    const list = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER) || '\'\'';

    const code = `${list}.${operator}(${item})`;

    if (block.workspace.options.oneBasedIndex) {
        return [`${code} + 1`, Blockly.JavaScript.ORDER_ADDITION];
    }

    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
