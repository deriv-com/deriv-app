import { translate } from '../../../utils/lang/i18n';

Blockly.Blocks.text_prompt_ext = {
    init() {
        this.jsonInit(this.definition());

        // Change shape based on selected type
        const typeField = this.getField('TYPE');
        typeField.setValidator(value => {
            if (value === 'TEXT') {
                this.setOutputShape(Blockly.OUTPUT_SHAPE_SQUARE);
                this.setOutput(true, 'String');
            } else if (value === 'NUMBER') {
                this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
                this.setOutput(true, 'Number');
            }
            this.initSvg();
            this.render(false);
            return undefined;
        });
    },
    definition(){
        return {
            message0: translate('prompt for %1 with message %2'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'TYPE',
                    options: [[translate('string'), 'TEXT'], [translate('number'), 'NUMBER']],
                },
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            output         : 'String',
            outputShape    : Blockly.OUTPUT_SHAPE_SQUARE,
            colour         : Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary : Blockly.Colours.Special3.colourTertiary,
            tooltip        : translate('Request user input'),
            category       : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': translate('Request user input'),
            'description' : translate('Prompts for an input of either text or numbers with a specific display message.'),
        };
    },
};

Blockly.JavaScript.text_prompt_ext = block => {
    let msg,
        code;

    if (block.getField('TEXT')) {
        // Internal message
        // eslint-disable-next-line no-underscore-dangle
        msg = Blockly.JavaScript.quote_(block.getFieldValue('TEXT'));
    } else {
        // External message
        msg = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_NONE) || '\'\'';
    }

    if (block.getFieldValue('TYPE') === 'NUMBER') {
        code = `parseFloat(window.prompt(${msg}))`;
    } else {
        code = `window.prompt(${msg})`;
    }

    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
