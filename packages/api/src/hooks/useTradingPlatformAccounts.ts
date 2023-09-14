import { useMemo } from 'react';
import useFetch from '../useFetch';

/** A custom hook that gets the list of created other CFD accounts. */
const useTradingPlatformAccounts = () => {
    const { data: derivez_accounts, ...derivez_rest } = useFetch('trading_platform_accounts', {
        payload: { platform: 'derivez' },
    });
    const { data: dxtrade_accounts, ...dxtrade_rest } = useFetch('trading_platform_accounts', {
        payload: { platform: 'dxtrade' },
    });

    /** Adding neccesary properties to derivez accounts */
    const modified_derivez_accounts = useMemo(
        () =>
            derivez_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                loginid: account.login,
            })),
        [derivez_accounts?.trading_platform_accounts]
    );

    /** Adding neccesary properties to dxtrade accounts */
    const modified_dxtrade_accounts = useMemo(
        () =>
            dxtrade_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                loginid: account.account_id,
            })),
        [dxtrade_accounts?.trading_platform_accounts]
    );

    const data = useMemo(
        () => ({
            dxtrade_accounts: modified_dxtrade_accounts || [],
            derivez_accounts: modified_derivez_accounts || [],
        }),
        [modified_dxtrade_accounts, modified_derivez_accounts]
    );

    return {
        /** List of all created other CFD accounts */
        data,
        ...{ ...derivez_rest, ...dxtrade_rest },
    };
};

export default useTradingPlatformAccounts;
