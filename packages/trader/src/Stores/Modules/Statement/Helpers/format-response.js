import CurrencyUtils            from 'deriv-shared/utils/currency';
import { toTitleCase }          from '_common/string_util';
import { localize }             from 'deriv-translations';
import { getMarketInformation } from 'Modules/Reports/Helpers/market-underlying';
import { toMoment }             from 'Utils/Date';
import { getSymbolDisplayName } from '../../Trading/Helpers/active-symbols';

export const formatStatementTransaction = (transaction, currency, active_symbols = []) => {
    const format_string           = 'DD MMM YYYY HH:mm:ss';
    const transaction_time        = toMoment(transaction.transaction_time).format(format_string);
    const payout                  = parseFloat(transaction.payout);
    const amount                  = parseFloat(transaction.amount);
    const balance                 = parseFloat(transaction.balance_after);
    const should_exclude_currency = true;
    const shortcode               = ['buy', 'sell'].includes(transaction.action_type) ? transaction.shortcode : null;
    const display_name            = shortcode ? getSymbolDisplayName(
        active_symbols,
        getMarketInformation(shortcode).underlying
    ) : '';

    return {
        action     : localize(toTitleCase(transaction.action_type) /* localize-ignore */), // handled in static_strings_app.js: 'Buy', 'Sell', 'Deposit', 'Withdrawal'
        date       : transaction_time,
        display_name,
        refid      : transaction.transaction_id,
        payout     : isNaN(payout) ? '-' : CurrencyUtils.formatMoney(currency, payout, should_exclude_currency),
        amount     : isNaN(amount) ? '-' : CurrencyUtils.formatMoney(currency, amount, should_exclude_currency),
        balance    : isNaN(balance) ? '-' : CurrencyUtils.formatMoney(currency, balance, should_exclude_currency),
        desc       : transaction.longcode.replace(/\n/g, '<br />'),
        id         : transaction.contract_id,
        app_id     : transaction.app_id,
        shortcode,
        action_type: transaction.action_type,
    };
};
