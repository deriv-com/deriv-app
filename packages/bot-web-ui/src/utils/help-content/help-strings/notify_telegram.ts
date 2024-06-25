import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block sends a message to a Telegram channel. You will need to create your own Telegram bot to use this block.'
        ),
        localize('Here’s how:'),
        localize(
            '1. Create a Telegram bot and get your Telegram API token. Read more on how to create bots in Telegram here: https://core.telegram.org/bots#6-botfather'
        ),
        localize(
            '2. Start a chat with your newly created Telegram bot and make sure to send it some messages before proceeding to the next step. (e.g. Hello Bot!)'
        ),
        localize(
            '3. Get the chat ID using the Telegram REST API (read more: https://core.telegram.org/bots/api#getupdates)'
        ),
        localize(
            '- Visit the following URL, make sure to replace <access_token> with the Telegram API token you created in Step 1: https://api.telegram.org/bot<access_token>/getUpdates'
        ),
        localize('- Find the chat ID property in the response, and copy the value of the id property'),
        localize(
            '4. Come back to Deriv Bot and add the Notify Telegram block to the workspace. Paste the Telegram API token and chat ID into the block fields accordingly.'
        ),
    ],
};
