import { localize } from 'deriv-translations';

export const contract_stages = Object.freeze({
    NOT_RUNNING      : { index: 0 , text: localize('Bot is not running') },
    STARTING         : { index: 1 , text: localize('Bot is starting') },
    PURCHASE_SENT    : { index: 2 , text: localize('Attempting to buy') },
    PURCHASE_RECEIVED: { index: 3 , text: localize('Buy is successful') },
    IS_STOPPING      : { index: 4 , text: localize('Bot is stopping') },
    CONTRACT_CLOSED  : { index: 5 , text: localize('Contract closed') },
});
