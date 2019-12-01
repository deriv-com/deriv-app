import { localize } from 'deriv-translations';

Blockly.Blocks.text_changeCase = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('to %1 %2'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'CASE',
                    options: [
                        [localize('UPPER CASE'), 'UPPERCASE'],
                        [localize('lower case'), 'LOWERCASE'],
                        [localize('Title Case'), 'TITLECASE'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            output         : 'String',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('Changes text case accordingly'),
            category       : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': localize('Change text case'),
            'description' : localize('Changes the capitalisation of a string of text to Upper case, Lower case, Title case.'),
        };
    },
};

Blockly.JavaScript.text_changeCase = block => {
    const operators = {
        UPPERCASE: '.toUpperCase()',
        LOWERCASE: '.toLowerCase()',
        TITLECASE: null,
    };
    const operator = operators[block.getFieldValue('CASE')];
    const textOrder = operator ? Blockly.JavaScript.ORDER_MEMBER : Blockly.JavaScript.ORDER_NONE;
    const text = Blockly.JavaScript.valueToCode(block, 'TEXT', textOrder) || '\'\'';

    let code;

    if (operator) {
        code = `${text}${operator}`;
    } else {
        // eslint-disable-next-line no-underscore-dangle
        const functionName = Blockly.JavaScript.provideFunction_('textToTitleCase', [
            // eslint-disable-next-line no-underscore-dangle
            `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(str) {
                return str.toLowerCase().split(' ').map(function(word) {
                    return word.replace(word[0], word[0].toUpperCase());
                }).join(' ');
            }`,
        ]);
        code = `${functionName}(${text})`;
    }

    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
