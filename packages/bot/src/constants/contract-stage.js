import { localize } from 'deriv-translations/src/i18next/i18n';

export const CONTRACT_STAGES = {
    not_running      : { index: 0 , text: localize('Bot is not running') },
    starting         : { index: 1 , text: localize('Bot is starting') },
    purchase_sent    : { index: 2 , text: localize('Attempting to Buy') },
    purchase_recieved: { index: 3 , text: localize('Buy Succeeded') },
    is_stopping      : { index: 4 , text: localize('Bot is stopping') },
    contract_closed  : { index: 5 , text: localize('Contract Closed') },
};
