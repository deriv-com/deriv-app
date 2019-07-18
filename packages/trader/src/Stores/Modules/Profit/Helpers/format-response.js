import { formatMoney }          from '_common/base/currency_base';
import { toMoment }             from 'Utils/Date';
import { getMarketInformation } from '../../../../Modules/Reports/Helpers/market-underlying';
import { getSymbolDisplayName } from '../../Trading/Helpers/active-symbols';

export const formatProfitTableTransactions = (transaction, currency, active_symbols = []) => {
    const format_string           = 'DD MMM YYYY HH:mm:ss';
    const purchase_time           = `${toMoment(+transaction.purchase_time).format(format_string)}`;
    const sell_time               = `${toMoment(+transaction.sell_time).format(format_string)}`;
    const payout                  = parseFloat(transaction.payout);
    const sell_price              = parseFloat(transaction.sell_price);
    const buy_price               = parseFloat(transaction.buy_price);
    const profit_loss             = formatMoney(currency, Number(sell_price - buy_price), true);
    const should_exclude_currency = true;
    const display_name            = getSymbolDisplayName(
        active_symbols,
        getMarketInformation(transaction.shortcode).underlying
    );

    return {
        ...transaction,
        ...{
            payout    : isNaN(payout) ? '-' : formatMoney(currency, payout, should_exclude_currency),
            sell_price: isNaN(sell_price) ? '-' : formatMoney(currency, sell_price, should_exclude_currency),
            buy_price : isNaN(buy_price) ? '-' : formatMoney(currency, buy_price, should_exclude_currency),
            profit_loss,
            sell_time,
            purchase_time,
            display_name,
        },
    };
};
