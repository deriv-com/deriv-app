import { formatMoney, toMoment } from '@deriv/shared';

import { getMarketInformation } from '../../../../Modules/Reports/Helpers/market-underlying';
import { getSymbolDisplayName } from '../../Trading/Helpers/active-symbols';

export const formatProfitTableTransactions = (transaction, currency, active_symbols = []) => {
    const format_string = 'DD MMM YYYY HH:mm:ss';
    const purchase_time = `${toMoment(+transaction.purchase_time).format(format_string)}`;
    const purchase_time_unix = transaction.purchase_time;
    const sell_time = `${toMoment(+transaction.sell_time).format(format_string)}`;
    const payout = parseFloat(transaction.payout);
    const sell_price = parseFloat(transaction.sell_price);
    const buy_price = parseFloat(transaction.buy_price);
    const profit_loss = formatMoney(currency, Number(sell_price - buy_price), true);
    const display_name = getSymbolDisplayName(active_symbols, getMarketInformation(transaction.shortcode).underlying);

    return {
        ...transaction,
        ...{
            payout,
            sell_price,
            buy_price,
            profit_loss,
            sell_time,
            purchase_time,
            display_name,
            purchase_time_unix,
        },
    };
};
