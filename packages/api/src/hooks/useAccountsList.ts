import { useMemo } from 'react';
import useAuthorize from './useAuthorize';

/** A custom hook that returns the list of accounts of the logged in user. */
const useAccountsList = () => {
    const { data: authorize_data, ...rest } = useAuthorize();

    // Add additional information to the authorize response.
    const modified_accounts = useMemo(() => {
        return authorize_data.account_list?.map(account => {
            return {
                ...account,
                /** Creation time of the account. */
                created_at: account.created_at ? new Date(account.created_at) : undefined,
                /** Date till client has excluded him/herself from the website, only present if client is self excluded. */
                excluded_until: account.excluded_until ? new Date(account.excluded_until) : undefined,
                /** Indicating whether the wallet is the currently active account. */
                is_active: account.loginid === authorize_data.loginid,
                /** indicating whether the account is a virtual-money account. */
                is_virtual: Boolean(account.is_virtual),
                /** indicating whether the account is marked as disabled or not. */
                is_disabled: Boolean(account.is_disabled),
                /** indicating whether the account is a trading account. */
                is_trading: account.account_category === 'trading',
                /** indicating whether the account is a wallet account. */
                is_wallet: account.account_category === 'wallet',
                /** The account ID of specified account. */
                loginid: `${account.loginid}`,
            } as const;
        });
    }, [authorize_data.account_list, authorize_data.loginid]);

    return {
        /** The list of accounts. */
        data: modified_accounts,
        ...rest,
    };
};

export default useAccountsList;
