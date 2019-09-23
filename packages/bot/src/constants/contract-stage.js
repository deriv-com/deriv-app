import { translate } from '../utils/tools';

export const CONTRACT_STAGES = {
    not_running‌     : { index: 0 , text: translate('Bot is not running') },
    purchase_sent    : { index: 1 , text: translate('Attempting to Buy') },
    purchase_recieved: { index: 2 , text: translate('Buy Succeeded') },
    bot_is_stopping  : { index: 3 , text: translate('Bot is stopping') },
    contract_closed  : { index: 4 , text: translate('Contract Closed') },
};
