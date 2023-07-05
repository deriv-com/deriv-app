import { useEffect, useMemo } from 'react';
import { useRequest } from '@deriv/api';
import useActiveWallet from './useActiveWallet';

const useActiveWalletCFDAccounts = () => {
    const wallet = useActiveWallet();
    const { mutate: mt5_mutate, ...mt5 } = useRequest('mt5_login_list');
    const { mutate: derivez_mutate, ...derivez } = useRequest('trading_platform_accounts');
    const { mutate: dxtrade_mutate, ...dxtrade } = useRequest('trading_platform_accounts');

    useEffect(() => {
        mt5_mutate();
        derivez_mutate({ payload: { platform: 'derivez' } });
        dxtrade_mutate({ payload: { platform: 'dxtrade' } });
    }, [derivez_mutate, dxtrade_mutate, mt5_mutate]);

    const ids = useMemo(() => wallet?.linked_to?.map(linked => linked.loginid), [wallet?.linked_to]);

    const mt5_accounts = useMemo(
        () => mt5.data?.mt5_login_list?.filter(account => ids?.includes(account.login)),
        [ids, mt5.data?.mt5_login_list]
    );
    const derivez_accounts = useMemo(
        () => derivez.data?.trading_platform_accounts?.filter(account => ids?.includes(account.login)),
        [derivez.data?.trading_platform_accounts, ids]
    );
    const dxtrade_accounts = useMemo(
        () => dxtrade.data?.trading_platform_accounts?.filter(account => ids?.includes(account.login)),
        [dxtrade.data?.trading_platform_accounts, ids]
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
        isLoading: mt5.isLoading || derivez.isLoading || dxtrade.isLoading,
    };
};

export default useActiveWalletCFDAccounts;
