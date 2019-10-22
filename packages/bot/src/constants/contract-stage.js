import { translate } from '../utils/tools';

export const contract_stages = Object.freeze({
    NOT_RUNNING      : { index: 0 , text: translate('Bot is not running') },
    STARTING         : { index: 1 , text: translate('Bot is starting') },
    PURCHASE_SENT    : { index: 2 , text: translate('Attempting to Buy') },
    PURCHASE_RECEIVED: { index: 3 , text: translate('Buy Succeeded') },
    IS_STOPPING      : { index: 4 , text: translate('Bot is stopping') },
    CONTRACT_CLOSED  : { index: 5 , text: translate('Contract Closed') },
});
