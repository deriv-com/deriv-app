import { localize } from 'deriv-translations/lib/i18n';

export const switch_account_notification = {
    key          : 'bot_switch_account',
    header       : localize('You have switched accounts.'),
    message      : localize('Our system will end any DBot trades that are running, and DBot will not place any new trades.'),
    type         : 'warning',
    is_persistent: true,
};
