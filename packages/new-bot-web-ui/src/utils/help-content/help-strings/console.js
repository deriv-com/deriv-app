import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block displays messages in the developer’s console with an input that can be either a string of text, a number, boolean, or an array of data.'
        ),
        localize('There are 4 message types:'),
        localize("1. 'Log' displays a regular message."),
        localize("2. 'Warn' displays a message in yellow to highlight something that needs attention."),
        localize("3. 'Error' displays a message in red to highlight something that needs to be resolved immediately."),
        localize("4. 'Table' takes an array of data, such as a list of candles, and displays it in a table format."),
    ],
};
