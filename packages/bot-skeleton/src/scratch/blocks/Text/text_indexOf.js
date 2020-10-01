import { localize } from '@deriv/translations';
import { emptyTextValidator } from '../../utils';

Blockly.Blocks.text_indexOf = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'in text {{ input_text1 }} find {{ first_or_last }} occurence of text {{ input_text2 }}',
                {
                    input_text1: '%1',
                    first_or_last: '%2',
                    input_text2: '%3',
                }
            ),
            args0: [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
                {
                    type: 'field_dropdown',
                    name: 'END',
                    options: [
                        [localize('first'), 'FIRST'],
                        [localize('last'), 'LAST'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'FIND',
                },
            ],
            output: 'String',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Search for a given string'),
            cateogry: Blockly.Categories.Text,
        };
    },
    meta() {
        return {
            display_name: localize('Search for string'),
            description: localize(
                'Searches through a string of text for a specific occurrence of a given character or word, and returns the position.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            VALUE: emptyTextValidator,
            FIND: emptyTextValidator,
        };
    },
};

Blockly.JavaScript.text_indexOf = block => {
    const functionName = block.getFieldValue('END') === 'FIRST' ? 'indexOf' : 'lastIndexOf';
    const substring = Blockly.JavaScript.valueToCode(block, 'FIND', Blockly.JavaScript.ORDER_NONE) || "''";
    const text = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER) || "''";

    const code = `${text}.${functionName}(${substring})`;
    if (block.workspace.options.oneBasedIndex) {
        return [`${code} + 1`, Blockly.JavaScript.ORDER_ADDITION];
    }
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
