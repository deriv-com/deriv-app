import { localize } from 'deriv-translations';
import config       from '../../../../../constants';

Blockly.Blocks.notify = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Notify %1 with sound: %2 %3'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'NOTIFICATION_TYPE',
                    options: config.lists.NOTIFICATION_TYPE,
                },
                {
                    type   : 'field_dropdown',
                    name   : 'NOTIFICATION_SOUND',
                    options: config.lists.NOTIFICATION_SOUND,
                },
                {
                    type : 'input_value',
                    name : 'MESSAGE',
                    check: null,
                },
            ],
            colour           : Blockly.Colours.Special3.colour,
            colourSecondary  : Blockly.Colours.Special3.colourSecondary,
            colourTertiary   : Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : localize('Displays a notification and optionally play selected sound'),
            category         : Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            'display_name': localize('Notify'),
            'description' : localize('This block displays a message. You can specify the color of the message and choose from 6 different sound options.'),
        };
    },
};

Blockly.JavaScript.notify = block => {
    const notificationType = block.getFieldValue('NOTIFICATION_TYPE');
    const sound = block.getFieldValue('NOTIFICATION_SOUND');
    const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE') || `"${localize('<empty message>')}"`;

    const code = `Bot.notify({ className: '${notificationType}', message: ${message}, sound: '${sound}'});\n`;
    return code;
};
