import { notify }                     from '../utils/broadcast';
import { observer as globalObserver } from '../../../utils/observer';
import { translate }                  from '../../../utils/lang/i18n';

export default Interface =>
    class extends Interface {
        getMiscInterface() {
            return {
                notify        : args => globalObserver.emit('Notify', args),
                notifyTelegram: (access_token, chat_id, text) => {
                    const url = `https://api.telegram.org/bot${access_token}/sendMessage`;
                    const onError = () => notify('warn', translate('The Telegram notification could not be sent'));

                    fetch(url, {
                        method : 'POST',
                        mode   : 'cors',
                        headers: { 'Content-Type': 'application/json' },
                        body   : JSON.stringify({ chat_id, text }),
                    })
                        .then(response => {
                            if (!response.ok) {
                                onError();
                            }
                        })
                        .catch(onError);
                },
                getTotalRuns  : () => this.tradeEngine.getTotalRuns(),
                getBalance    : type => this.tradeEngine.getBalance(type),
                getTotalProfit: toString =>
                    this.tradeEngine.getTotalProfit(toString, this.tradeEngine.tradeOptions.currency),
            };
        }
    };
