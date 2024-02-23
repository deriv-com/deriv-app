import { CurrenciesListOrder } from '@/constants';
import { TCurrencyConfig } from '@/hooks/useCurrencies';

export const reorderCurrencies = (list: TCurrencyConfig[], type: keyof typeof CurrenciesListOrder) => {
    const newOrder = CurrenciesListOrder[type];

    return list.sort((a, b) => {
        if (newOrder.indexOf(a.id) < newOrder.indexOf(b.id)) {
            return -1;
        }
        if (newOrder.indexOf(a.id) > newOrder.indexOf(b.id)) {
            return 1;
        }
        return 0;
    });
};
