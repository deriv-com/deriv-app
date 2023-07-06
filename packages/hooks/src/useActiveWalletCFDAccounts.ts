import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import useActiveWallet from './useActiveWallet';

const useActiveWalletCFDAccounts = () => {
    const wallet = useActiveWallet();
    const { data: mt5_data, isSuccess: mt5_is_success } = useFetch('mt5_login_list');
    const { data: derivez_data, isSuccess: derivez_is_success } = useFetch('trading_platform_accounts', {
        payload: { platform: 'derivez' },
    });

    const { data: dxtrade_data, isSuccess: dxtrade_is_success } = useFetch('trading_platform_accounts', {
        payload: { platform: 'dxtrade' },
    });

    const ids = useMemo(() => wallet?.linked_to?.map(linked => linked.loginid), [wallet?.linked_to]);

    const mt5_accounts = useMemo(
        () => mt5_data?.mt5_login_list?.filter(account => ids?.includes(account.login)),
        [ids, mt5_data?.mt5_login_list]
    );
    const derivez_accounts = useMemo(
        () => derivez_data?.trading_platform_accounts?.filter(account => ids?.includes(account.login)),
        [derivez_data?.trading_platform_accounts, ids]
    );
    const dxtrade_accounts = useMemo(
        () => dxtrade_data?.trading_platform_accounts?.filter(account => ids?.includes(account.login)),
        [dxtrade_data?.trading_platform_accounts, ids]
    );

    const modified_mt5_accounts = useMemo(
        () => mt5_accounts?.map(account => ({ ...account, foo: 'bar' })),
        [mt5_accounts]
    );
    const modified_derivez_accounts = useMemo(
        () => derivez_accounts?.map(account => ({ ...account, foo: 'bar' })),
        [derivez_accounts]
    );
    const modified_dxtrade_accounts = useMemo(
        () => dxtrade_accounts?.map(account => ({ ...account, foo: 'bar' })),
        [dxtrade_accounts]
    );

    const data = useMemo(
        () => ({
            mt5_accounts: modified_mt5_accounts,
            derivez_accounts: modified_derivez_accounts,
            dxtrade_accounts: modified_dxtrade_accounts,
        }),
        [modified_derivez_accounts, modified_dxtrade_accounts, modified_mt5_accounts]
    );

    return {
        data,
        is_success: [mt5_is_success, dxtrade_is_success, derivez_is_success].every(Boolean),
    };
};

export default useActiveWalletCFDAccounts;
