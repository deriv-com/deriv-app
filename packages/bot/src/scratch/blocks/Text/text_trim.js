import { localize } from 'deriv-translations';

Blockly.Blocks.text_trim = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: localize('trim spaces from %1 of %2'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'MODE',
                    options: [
                        [localize('both sides'), 'BOTH'],
                        [localize('left side'), 'LEFT'],
                        [localize('right side'), 'RIGHT'],
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
            tooltip        : localize('Trims spaces'),
            category       : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': localize('Trim spaces'),
            'description' : localize('Trims the spaces within a given string or text.'),
        };
    },
};

Blockly.JavaScript.text_trim = block => {
    const operators = {
        LEFT : '.replace(/^[\\s\\xa0]+/, \'\')',
        RIGHT: '.replace(/[\\s\\xa0]+$/, \'\')',
        BOTH : '.trim()',
    };

    const operator = operators[block.getFieldValue('MODE')];
    const text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_MEMBER) || '\'\'';

    const code = `${text}${operator}`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
