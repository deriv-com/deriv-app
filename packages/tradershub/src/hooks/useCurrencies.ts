import { useMemo } from 'react';
import { reorderCurrencies } from '@/helpers';
import { useQuery } from '@deriv/api';

type TWebsiteStatus = NonNullable<ReturnType<typeof useQuery<'website_status'>>['data']>['website_status'];
export type TCurrencyConfig = NonNullable<TWebsiteStatus>['currencies_config'][string] & {
    id: string;
};

export type TCurrencies = {
    CRYPTO: TCurrencyConfig[];
    FIAT: TCurrencyConfig[];
};

/** A custom hook to get the currency config information from `website_status` endpoint and in predefined order */
const useCurrencies = () => {
    const { data, ...rest } = useQuery('website_status');

    const currencyConfig = useMemo(() => {
        if (!data?.website_status?.currencies_config) return;
        const currencies: TCurrencies = {
            FIAT: [],
            CRYPTO: [],
        };

        // map the currencies to their respective types (FIAT or CRYPTO) with their id
        Object.entries(data?.website_status?.currencies_config).forEach(([key, value]) => {
            if (value.type === 'fiat') {
                currencies.FIAT.push({ ...value, id: key });
            } else {
                currencies.CRYPTO.push({ ...value, id: key });
            }
        });

        // reorder the currencies based on the predefined order
        return {
            FIAT: reorderCurrencies(currencies.FIAT, 'FIAT'),
            CRYPTO: reorderCurrencies(currencies.CRYPTO, 'CRYPTO'),
        };
    }, [data?.website_status?.currencies_config]);

    return {
        data: currencyConfig,
        ...rest,
    };
};

export default useCurrencies;
