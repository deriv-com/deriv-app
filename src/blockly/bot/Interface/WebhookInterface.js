import { translate } from '@i18n';
import { notify, notifyError } from '../broadcast';

export default Interface =>
    class extends Interface {
        // eslint-disable-next-line class-methods-use-this
        sendWebhook(url, payload) {
            const onError = error => {
                notify('warn', translate('Unable to send webhook'));
                if (error) {
                    notifyError(JSON.stringify(error, ['message', 'arguments', 'type', 'name']));
                }
            };
            const fetchOption = {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
            };

            if (payload) {
                fetchOption.body = JSON.stringify(payload);
            }

            fetch(url, fetchOption)
                .then(response => {
                    if (!response.ok) {
                        onError();
                    }
                })
                .catch(error => onError(error));
        }

        getWebhookInterface() {
            return {
                sendWebhook: this.sendWebhook,
            };
        }
    };
