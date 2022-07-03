import { localize } from '@deriv/translations';
import { notify } from '../../utils';

export const notifyTelegram = (access_token, chat_id, text) => {
    const url = `https://api.telegram.org/bot${access_token}/sendMessage`;
    const onError = () => notify('warn', localize('The Telegram notification could not be sent'));

    fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text }),
    })
        .then(response => {
            if (!response.ok) {
                onError();
            }
        })
        .catch(onError);
};
