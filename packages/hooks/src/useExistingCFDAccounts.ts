import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import useActiveWalletAccount from './useActiveWalletAccount';

type TAccount = {
    cfd_type?: 'mt5' | 'derivez' | 'dxtrade';
    market_type?: 'financial' | 'synthetic' | 'all';
};

const getAccountIcon = ({ cfd_type, market_type }: TAccount) => {
    switch (cfd_type) {
        case 'mt5': {
            switch (market_type) {
                case 'financial':
                    return 'IcRebrandingMt5FinancialDashboard';
                case 'synthetic':
                    return 'IcRebrandingMt5DerivedDashboard';
                case 'all':
                    return 'IcRebrandingMt5SwapFree';
                default:
                    return 'IcRebrandingDmt5Dashboard';
            }
        }
        case 'derivez':
            return 'IcRebrandingDerivEz';
        case 'dxtrade':
            return 'IcRebrandingDerivX';
        default:
            return '';
    }
};

/**
 * @description This hook is used to get the created CFD accounts of the user.
 */
const useExistingCFDAccounts = () => {
    const wallet = useActiveWalletAccount();
    const { data: mt5, ...mt5_rest } = useFetch('mt5_login_list');
    const { data: derivez, ...derivez_rest } = useFetch('trading_platform_accounts', {
        payload: { platform: 'derivez' },
    });
    const { data: dxtrade, ...dxtrade_rest } = useFetch('trading_platform_accounts', {
        payload: { platform: 'dxtrade' },
    });

    /**
     * @description This is the modified MT5 accounts that will be used in the CFD account creation.
     */
    const modified_mt5_accounts = useMemo(() => {
        /** Adding the neccesary properties to the response */
        const getAccountInfo = (login?: string) => {
            return {
                platform: wallet?.linked_to?.find(linked => linked.loginid === login)?.platform,
                display_login: login?.replace(/^(MT[DR]?)/, ''),
            };
        };

        return mt5?.mt5_login_list?.map(account => ({
            ...account,
            ...getAccountInfo(account.login),
            loginid: account.login,
            transfer_icon: getAccountIcon({ cfd_type: 'mt5', ...account }),
        }));
    }, [mt5?.mt5_login_list, wallet?.linked_to]);

    const modified_derivez_accounts = useMemo(
        () =>
            derivez?.trading_platform_accounts?.map(account => ({
                ...account,
                loginid: account.login,
                transfer_icon: getAccountIcon({ cfd_type: 'derivez' }),
            })),
        [derivez?.trading_platform_accounts]
    );

    const modified_dxtrade_accounts = useMemo(
        () =>
            dxtrade?.trading_platform_accounts?.map(account => ({
                ...account,
                is_added: true,
                loginid: account.account_id,
                transfer_icon: getAccountIcon({ cfd_type: 'dxtrade' }),
            })),
        [dxtrade?.trading_platform_accounts]
    );

    const data = useMemo(
        () => ({
            mt5_accounts: modified_mt5_accounts || [],
            dxtrade_accounts: modified_dxtrade_accounts || [],
            derivez_accounts: modified_derivez_accounts || [],
        }),
        [modified_mt5_accounts, modified_dxtrade_accounts, modified_derivez_accounts]
    );

    return {
        data,
        ...{ ...mt5_rest, ...dxtrade_rest, ...derivez_rest },
        isLoading: mt5_rest.isLoading || dxtrade_rest.isLoading || derivez_rest.isLoading,
        isSuccess: [mt5_rest.isSuccess, dxtrade_rest.isSuccess, derivez_rest.isSuccess].every(Boolean),
    };
};

export default useExistingCFDAccounts;
