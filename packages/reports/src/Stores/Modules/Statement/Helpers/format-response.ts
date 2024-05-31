import { formatMoney, toTitleCase, toMoment, getMarketInformation, getSymbolDisplayName } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { ActiveSymbols, Statement } from '@deriv/api-types';

export const formatStatementTransaction = (
    transaction: NonNullable<Statement['transactions']>[number],
    currency: string,
    active_symbols: ActiveSymbols = []
) => {
    const { action_type, app_id, contract_id, longcode, purchase_time, withdrawal_details } = transaction;
    const format_string = 'DD MMM YYYY HH:mm:ss';
    const transaction_time = toMoment(transaction.transaction_time).format(format_string);
    const payout = transaction.payout ?? NaN;
    const amount = transaction.amount ?? NaN;
    const balance = transaction.balance_after ?? NaN;
    const should_exclude_currency = true;
    const shortcode = ['buy', 'sell'].includes(action_type ?? '') ? transaction.shortcode : null;
    const display_name = shortcode
        ? getSymbolDisplayName(active_symbols, getMarketInformation(shortcode).underlying)
        : '';

    return {
        action: localize(toTitleCase(action_type ?? '')), // 'Buy', 'Sell', 'Deposit', 'Withdrawal'
        date: transaction_time,
        display_name,
        refid: transaction.transaction_id,
        payout: isNaN(payout) ? '-' : formatMoney(currency, payout, should_exclude_currency),
        amount: isNaN(amount) ? '-' : formatMoney(currency, amount, should_exclude_currency),
        balance: isNaN(balance) ? '-' : formatMoney(currency, balance, should_exclude_currency),
        desc: longcode?.replace(/\n/g, '<br />'),
        id: contract_id,
        app_id,
        shortcode,
        action_type,
        purchase_time,
        transaction_time: transaction.transaction_time,
        ...(withdrawal_details && {
            withdrawal_details,
            longcode,
        }),
    };
};
