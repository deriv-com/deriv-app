import { useMemo } from 'react';
import useQuery from '../useQuery';
import useActiveWalletAccount from './useActiveWalletAccount';
import useAuthorize from './useAuthorize';
import { displayMoney } from '../utils';

/** A custom hook that gets the list created MT5 accounts of the user. */
const useMT5AccountsList = () => {
    const { data: authorize_data, isSuccess } = useAuthorize();
    const { data: wallet } = useActiveWalletAccount();

    const { data: mt5_accounts, ...mt5_accounts_rest } = useQuery('mt5_login_list', {
        options: { enabled: isSuccess },
    });

    /**
     * @description The list of created MT5 accounts
     */
    const modified_mt5_accounts = useMemo(() => {
        /** Adding the neccesary properties to the response */
        const getAccountInfo = (login?: string) => {
            return {
                /** The platform of the account linked to the wallet */
                platform: wallet?.linked_to?.find(linked => linked.loginid === login)?.platform,
                /** The formatted display login of the account */
                display_login: login?.replace(/^(MT[DR]?)/, ''),
            };
        };

        return mt5_accounts?.mt5_login_list?.map(account => ({
            ...account,
            ...getAccountInfo(account.login),
            /** The id of the account */
            loginid: account.login,
            /** The platform of the account */
            platform: 'mt5' as const,
            /** The balance of the account in currency format. */
            display_balance: displayMoney(account.balance || 0, account.currency || 'USD', {
                preferred_language: authorize_data?.preferred_language,
            }),
        }));
    }, [authorize_data?.preferred_language, mt5_accounts?.mt5_login_list, wallet?.linked_to]);

    return {
        /** The list of created MT5 accounts */
        data: modified_mt5_accounts,
        ...mt5_accounts_rest,
    };
};

export default useMT5AccountsList;
