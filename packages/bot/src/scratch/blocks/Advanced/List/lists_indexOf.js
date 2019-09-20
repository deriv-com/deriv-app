import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.lists_indexOf = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('in list %1 find %2 occurence of item %3'),
            args0   : [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
                {
                    type   : 'field_dropdown',
                    name   : 'END',
                    options: [[translate('first'), 'FIRST'], [translate('last'), 'LAST']],
                },
                {
                    type: 'input_value',
                    name: 'FIND',
                },
            ],
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('Finds the position of an item in a given list'),
            category       : Blockly.Categories.List,
        };
    },
    meta(){
        return {
            'display_name': translate('List item position'),
            'description' : translate('Finds the position of an item in a given list.'),
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
