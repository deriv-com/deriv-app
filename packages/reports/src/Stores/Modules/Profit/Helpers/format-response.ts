import { formatMoney, toMoment, getSymbolDisplayName, getMarketInformation } from '@deriv/shared';
import { ActiveSymbols, ProfitTable } from '@deriv/api-types';

export type TTransaction = NonNullable<NonNullable<ProfitTable>['transactions']>[number];

export const formatProfitTableTransactions = (
    transaction: TTransaction,
    currency: string,
    active_symbols: ActiveSymbols = []
) => {
    const format_string = 'DD MMM YYYY HH:mm:ss';
    const purchase_time =
        transaction.purchase_time && `${toMoment(Number(transaction.purchase_time)).format(format_string)}`;
    const purchase_time_unix = transaction.purchase_time;
    const sell_time = transaction.sell_time && `${toMoment(Number(transaction.sell_time)).format(format_string)}`;
    const payout = transaction.payout ?? NaN;
    const sell_price = transaction.sell_price ?? NaN;
    const buy_price = transaction.buy_price ?? NaN;
    const profit_loss = formatMoney(currency, Number(sell_price - buy_price), true);
    const display_name = getSymbolDisplayName(
        active_symbols,
        getMarketInformation(transaction.shortcode ?? '').underlying
    );

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
