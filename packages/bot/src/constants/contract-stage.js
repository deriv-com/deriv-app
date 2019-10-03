import { translate } from '../utils/tools';

export const CONTRACT_STAGES = {
    not_running      : { index: 0 , text: translate('Bot is not running') },
    bot_starting     : { index: 1, text: translate('Bot is starting') },
    purchase_sent    : { index: 2 , text: translate('Attempting to Buy') },
    purchase_recieved: { index: 3 , text: translate('Buy Succeeded') },
    bot_is_stopping  : { index: 4 , text: translate('Bot is stopping') },
    contract_closed  : { index: 5 , text: translate('Contract Closed') },
};
