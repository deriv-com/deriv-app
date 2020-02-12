import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block creates a dialog box that uses a customised message to prompt for an input. The input can be either a string of text or a number and can be assigned to a variable. When the dialog box is displayed, your strategy is paused and will only resume after you enter a response and click "OK".'
        ),
        localize(
            'Note: If the dialog box appears too many times while your bot is running, your strategy might be interrupted.'
        ),
    ],
};
