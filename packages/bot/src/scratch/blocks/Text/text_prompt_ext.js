import { localize } from 'deriv-translations';

Blockly.Blocks.text_prompt_ext = {
    init() {
        this.jsonInit(this.definition());
        const typeField = this.getField('TYPE');
        typeField.setValidator(value => {
            if (value === 'TEXT') {
                this.setOutput(true, 'String');
            } else if (value === 'NUMBER') {
                this.setOutput(true, 'Number');
            }
            this.initSvg();
            this.render(false);
            return undefined;
        });
    },
    definition(){
        return {
            message0: localize('prompt for %1 with message %2'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'TYPE',
                    options: [[localize('string'), 'TEXT'], [localize('number'), 'NUMBER']],
                },
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            output         : 'String',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary : Blockly.Colours.Special3.colourTertiary,
            tooltip        : localize('Request an input'),
            category       : Blockly.Categories.Text,
        };
    },
    meta(){
        return {
            'display_name': localize('Request an input'),
            'description' : localize('This block creates a dialog box that uses a customised message to prompt for an input. The input can be either a string of text or a number.'),
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
