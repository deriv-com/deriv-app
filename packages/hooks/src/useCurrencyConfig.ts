import { useFetch } from '@deriv/api';

const useCurrencyConfig = (currency: string) => {
    const { data, ...rest } = useFetch('website_status');
    const currency_config = data?.website_status?.currencies_config?.[currency];
    const modified_currency_config = currency_config
        ? {
              ...currency_config,
              is_crypto: currency_config.type === 'crypto',
              is_fiat: currency_config.type === 'fiat',
              code: currency,
              icon: `IcCurrency${currency[0].toUpperCase() + currency.slice(1).toLowerCase()}`,
          }
        : undefined;

    return {
        ...rest,
        data: modified_currency_config,
    };
};

export default useCurrencyConfig;
