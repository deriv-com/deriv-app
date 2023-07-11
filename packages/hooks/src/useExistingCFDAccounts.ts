import { useEffect, useMemo } from 'react';
import { useRequest } from '@deriv/api';
import useActiveWallet from './useActiveWallet';
import { useStore } from '@deriv/stores';

/**
 *
 * @description This hook is used to get the created CFD accounts of the user.
 */
const useExistingCFDAccounts = () => {
    const { traders_hub } = useStore();
    const { combined_cfd_mt5_accounts } = traders_hub;
    const wallet = useActiveWallet();
    const { mutate: mt5_mutate, ...mt5 } = useRequest('mt5_login_list');
    const { mutate: derivez_mutate, ...derivez } = useRequest('trading_platform_accounts');
    const { mutate: dxtrade_mutate, ...dxtrade } = useRequest('trading_platform_accounts');

    useEffect(() => {
        mt5_mutate();
        derivez_mutate({ payload: { platform: 'derivez' } });
        dxtrade_mutate({ payload: { platform: 'dxtrade' } });
    }, [derivez_mutate, dxtrade_mutate, mt5_mutate]);

    /**
     *
     * @description This is the modified MT5 accounts that will be used in the CFD account creation.
     */
    const modified_mt5_accounts = useMemo(() => {
        const getAccountInfo = (login?: string) => {
            return {
                platform: wallet?.linked_to?.find(linked => linked.loginid === login)?.platform,
                icon: combined_cfd_mt5_accounts?.find(cfd => cfd.login === login)?.icon,
                description: combined_cfd_mt5_accounts?.find(cfd => cfd.login === login)?.description,
                name: combined_cfd_mt5_accounts?.find(cfd => cfd.login === login)?.name,
                sub_title: combined_cfd_mt5_accounts?.find(cfd => cfd.login === login)?.sub_title,
                action_type: 'multi-action',
            };
        };

        return mt5.data?.mt5_login_list?.map(account => ({
            ...account,
            ...getAccountInfo(account.login),
        }));
    }, [mt5.data?.mt5_login_list, wallet?.linked_to, combined_cfd_mt5_accounts]);

    // const modified_derivez_accounts = useMemo(
    //     () => derivez.data?.trading_platform_accounts?.map(account => ({ ...account,  })),
    //     [derivez.data?.trading_platform_accounts]
    // );
    // const modified_dxtrade_accounts = useMemo(
    //     () => dxtrade.data?.trading_platform_accounts?.map(account => ({ ...account, })),
    //     [dxtrade.data?.trading_platform_accounts]
    // );

    const data = useMemo(
        () => ({
            mt5_accounts: modified_mt5_accounts,
            // derivez_accounts: modified_derivez_accounts,
            // dxtrade_accounts: modified_dxtrade_accounts,
        }),
        [modified_mt5_accounts]
    );

    return {
        data,
        isLoading: mt5.isLoading || derivez.isLoading || dxtrade.isLoading,
    };
};

export default useExistingCFDAccounts;
