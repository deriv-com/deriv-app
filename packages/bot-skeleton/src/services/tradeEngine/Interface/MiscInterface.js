import { localize } from '@deriv/translations';
import { notify } from '../utils/broadcast';
import { observer as globalObserver } from '../../../utils/observer';
import { getBalance } from '../trade/Balance';
import { getTotalRuns, getTotalProfit } from '../trade/Total';
import $scope from '../utils/cliTools';

const getMiscInterface = () => {
    return {
        notify: args => globalObserver.emit('ui.log.notify', args),
        console: ({ type, message }) => console[type](message), // eslint-disable-line no-console
        notifyTelegram: (access_token, chat_id, text) => {
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
        },
        getTotalRuns: () => getTotalRuns(),
        getBalance: type => getBalance(type),
        getTotalProfit: toString => getTotalProfit(toString, $scope.tradeOptions.currency),
    };
};

export default getMiscInterface;
