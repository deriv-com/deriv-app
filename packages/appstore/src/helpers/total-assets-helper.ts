import { useCFDAccounts, useExchangeRate, usePlatformAccounts } from '@deriv/hooks';

export const isRatesLoaded = (
    is_real: boolean,
    total_assets_real_currency: string | undefined,
    platform_real_accounts: ReturnType<typeof usePlatformAccounts>['real'],
    cfd_real_accounts: ReturnType<typeof useCFDAccounts>['real'],
    exchange_rates: ReturnType<typeof useExchangeRate>['exchange_rates']
) => {
    // for demo
    if (!is_real) return true;

    const currencies_need_exchange_rates: string[] = [];
    platform_real_accounts.forEach(account => {
        const target = account.currency || total_assets_real_currency || '';
        if (target && total_assets_real_currency !== target && !currencies_need_exchange_rates.includes(target)) {
            currencies_need_exchange_rates.push(target);
        }
    });
    cfd_real_accounts.forEach(account => {
        const target = account.currency || total_assets_real_currency || '';
        if (target && total_assets_real_currency !== target && !currencies_need_exchange_rates.includes(target)) {
            currencies_need_exchange_rates.push(target);
        }
    });

    const exchange_rates_keys = Object.keys(exchange_rates?.[total_assets_real_currency ?? ''] ?? {});
    const is_all_currencies_inside = currencies_need_exchange_rates.every(currency =>
        exchange_rates_keys.includes(currency)
    );

    return (
        currencies_need_exchange_rates.length === 0 ||
        (total_assets_real_currency &&
            exchange_rates?.[total_assets_real_currency] &&
            currencies_need_exchange_rates.length &&
            is_all_currencies_inside)
    );
};
