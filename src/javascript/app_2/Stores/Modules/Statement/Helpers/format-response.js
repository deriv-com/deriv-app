import { formatMoney } from '_common/base/currency_base';
import { localize }    from '_common/localize';
import { toTitleCase } from '_common/string_util';
import { toMoment }    from 'Utils/Date';

export const formatStatementTransaction = (transaction, currency) => {
    const moment_obj = toMoment(transaction.transaction_time);
    const date_str   = moment_obj.format('YYYY-MM-DD');
    const time_str   = `${moment_obj.format('HH:mm:ss')} GMT`;
    const payout     = parseFloat(transaction.payout);
    const amount     = parseFloat(transaction.amount);
    const balance    = parseFloat(transaction.balance_after);
    const should_exclude_currency = true;

    return {
        action : localize(toTitleCase(transaction.action_type) /* localize-ignore */), // handled in static_strings_app_2.js: 'Buy', 'Sell', 'Deposit', 'Withdrawal'
        date   : `${date_str}\n${time_str}`,
        refid  : transaction.transaction_id,
        payout : isNaN(payout)  ? '-' : formatMoney(currency, payout,  should_exclude_currency),
        amount : isNaN(amount)  ? '-' : formatMoney(currency, amount,  should_exclude_currency),
        balance: isNaN(balance) ? '-' : formatMoney(currency, balance, should_exclude_currency),
        desc   : transaction.longcode.replace(/\n/g, '<br />'),
        id     : transaction.contract_id,
        app_id : transaction.app_id,
    };
};
