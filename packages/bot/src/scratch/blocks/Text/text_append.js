import { translate } from '../../../utils/lang/i18n';

Blockly.Blocks.text_append = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('to %1 append text %2'),
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VAR',
                    variable: translate('text'),
                },
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour           : Blockly.Colours.Utility.colour,
            colourSecondary  : Blockly.Colours.Utility.colourSecondary,
            colourTertiary   : Blockly.Colours.Utility.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : translate('Appends a given text to a varialbe'),
            category         : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': translate('Text Append'),
            'description' : translate('Appends a given text to a variable.'),
        };
    },
};

Blockly.JavaScript.text_append = block => {
    const forceString = value => {
        const strRegExp = /^\s*'([^']|\\')*'\s*$/;
        if (strRegExp.test(value)) {
            return value;
        }
        return `String(${value})`;
    };

    // eslint-disable-next-line no-underscore-dangle
    const varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    const value = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_NONE) || '\'\'';

    const code = `${varName} += ${forceString(value)};\n`;
    return code;
};
