import { useMemo } from 'react';
import useInvalidateQuery from '../useInvalidateQuery';
import useMutation from '../useMutation';
import useCurrencyConfig from './useCurrencyConfig';
import { displayMoney } from '../utils';

/** A custom hook to create new wallet account */
const useCreateWallet = () => {
    const invalidate = useInvalidateQuery();
    const { getConfig } = useCurrencyConfig();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('new_account_wallet', {
        onSuccess: () => {
            invalidate('authorize');
            invalidate('available_accounts');
        },
    });

    const mutate = (params: Parameters<typeof _mutate>[0]['payload']) => {
        return _mutate({ payload: params });
    };

    const modified_data = useMemo(() => {
        if (!data?.new_account_wallet) return;
        const currencyConfig = getConfig(data?.new_account_wallet.currency || 'USD');
        return {
            ...data.new_account_wallet,
            /** The balance of the account in currency format. */
            display_balance: displayMoney(0, currencyConfig?.display_code || 'USD', {
                fractional_digits: currencyConfig?.fractional_digits,
            }),
        };
    }, [data?.new_account_wallet, getConfig]);

    return {
        /** New account information */
        data: modified_data,
        /** A function to create new wallet */
        mutate,
        ...rest,
    };
};

export default useCreateWallet;
