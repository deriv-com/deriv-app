import { useFetch } from '@deriv/api';

const useCurrencyConfig = (currency: string) => {
    const { data, ...rest } = useFetch('website_status');
    const currency_config = data?.website_status?.currencies_config?.[currency];
    const modified_currency_config = currency_config
        ? {
              ...currency_config,
              is_crypto: currency_config.type === 'crypto',
              is_fiat: currency_config.type === 'fiat',
              is_aud: currency === 'AUD',
              is_usd: currency === 'USD',
              is_eur: currency === 'EUR',
              is_gbp: currency === 'GBP',
              is_eth: currency === 'ETH',
              is_btc: currency === 'BTC',
              is_ltc: currency === 'LTC',
              is_usdt: currency === 'USDT',
              is_usdc: currency === 'USDC',
              is_eurs: currency === 'EURS',
              is_eusdt: currency === 'eUSDT',
              is_tusdt: currency === 'tUSDT',
              is_usdk: currency === 'USDK',
              is_idk: currency === 'IDK',
              is_pax: currency === 'PAX',
              is_tusd: currency === 'TUSD',
              is_ust: currency === 'UST',
              is_usb: currency === 'USB',
              is_dai: currency === 'DAI',
              is_busd: currency === 'BUSD',
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
