import { CurrenciesListOrder } from '@/constants';
import { TCurrencyConfig } from '@/hooks/useCurrencies';

/**
 * Reorder currencies list based on the type and the defined order as `CurrenciesListOrder`.
 * @param {TCurrencyConfig[]} list - The list of currencies.
 * @param {keyof typeof CurrenciesListOrder} type  - The type of the order.
 * @returns {TCurrencyConfig[]} The reordered list of currencies.
 */
export const reorderCurrencies = (list: TCurrencyConfig[], type: keyof typeof CurrenciesListOrder) => {
    const newOrder = CurrenciesListOrder[type];

    return list.sort((a, b) => {
        if (newOrder.indexOf(String(a.id)) < newOrder.indexOf(String(b.id))) {
            return -1;
        }
        if (newOrder.indexOf(String(a.id)) > newOrder.indexOf(String(b.id))) {
            return 1;
        }
        return 0;
    });
};
