import { translate } from '../../../utils/lang/i18n';

Blockly.Blocks.text_print = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('print %1'),
            args0   : [
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour           : Blockly.Colours.Binary.colour,
            colourSecondary  : Blockly.Colours.Binary.colourSecondary,
            colourTertiary   : Blockly.Colours.Binary.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : translate('Text Print Tooltip'),
            category         : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': translate('Text Print'),
            'description' : translate('Text Print Description'),
        };
    },
};

Blockly.JavaScript.text_print = block => {
    const msg = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_NONE) || '\'\'';
    const code = `window.alert(${msg});\n`;
    return code;
};
