import { localize } from '@deriv/translations';
import { emptyTextValidator } from '../../../../utils';
import { config } from '../../../../../constants/config';

Blockly.Blocks.console = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Console %1 value: %2'),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'CONSOLE_TYPE',
                    options: [
                        [localize('Log'), 'log'],
                        [localize('Warn'), 'warn'],
                        [localize('Error'), 'error'],
                        [localize('Table'), 'table'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'MESSAGE',
                    check: null,
                },
            ],
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Displays a message in conosle developer tool'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Console'),
            description: localize('This block console a message. You can see the message in console developer tool .'),
        };
    },
    getRequiredValueInputs() {
        return {
            MESSAGE: emptyTextValidator,
        };
    },
};

Blockly.JavaScript.console = block => {
    const consoleType = block.getFieldValue('CONSOLE_TYPE');
    const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE') || `"${localize('<empty message>')}"`;

    const code = `Bot.console({ type: '${consoleType}', message: ${message}});\n`;
    return code;
};
