import { useMemo } from 'react';
import useAuthorize from './useAuthorize';
import useCurrencyConfig from './useCurrencyConfig';

/** A custom hook that gets the list of all wallet accounts for the current user. */
const useWalletAccountsList = () => {
    const { data: authorize_data, ...rest } = useAuthorize();
    const { getConfig } = useCurrencyConfig();

    // Filter out non-wallet accounts.
    const filtered_accounts = useMemo(
        () => authorize_data?.account_list?.filter(account => account.account_category === 'wallet'),
        [authorize_data]
    );

    // Add additional information to each wallet account.
    const modified_accounts = useMemo(() => {
        return filtered_accounts?.map(wallet => {
            const wallet_currency_type = wallet.is_virtual ? 'Demo' : wallet.currency || '';
            const dtrade_loginid = wallet.linked_to?.find(account => account.platform === 'dtrade')?.loginid;
            const currency_config = wallet.currency ? getConfig(wallet.currency) : undefined;

            return {
                ...wallet,
                /** The DTrade account ID of this wallet */
                dtrade_loginid,
                /** Wallet account's currency config information */
                currency_config,
                /** Returns the wallet's currency type. ex: `Demo`, `USD`, etc. */
                wallet_currency_type,
                /** Returns if the wallet is a crypto wallet. */
                is_crypto: currency_config?.is_crypto,
                /** Creation time of the wallet account. */
                created_at: wallet.created_at ? new Date(wallet.created_at) : undefined,
                /** Date till client has excluded him/herself from the website, only present if client is self excluded. */
                excluded_until: wallet.excluded_until ? new Date(wallet.excluded_until) : undefined,
                /** Indicating whether the wallet account is the currently active account. */
                is_active: wallet.loginid === authorize_data?.loginid,
                /** Indicating whether any linked account is active */
                is_linked_account_active: wallet.linked_to?.some(
                    account => account.loginid === authorize_data?.loginid
                ),
                /** indicating whether the account is marked as disabled or not. */
                is_disabled: Boolean(wallet.is_disabled),
                /** indicating whether the wallet account is a virtual-money account. */
                is_virtual: Boolean(wallet.is_virtual),
                /** The account ID of specified wallet account. */
                loginid: `${wallet.loginid}`,
                /** Landing company shortcode the account belongs to. */
                landing_company_name: wallet.landing_company_name?.replace('maltainvest', 'malta'),
                /** Indicating whether the wallet is a maltainvest wallet. */
                is_malta_wallet: wallet.landing_company_name === 'maltainvest',
            } as const;
        });
    }, [filtered_accounts, getConfig]);

    // Sort wallet accounts alphabetically by fiat, crypto, then virtual.
    const sorted_accounts = useMemo(() => {
        if (!modified_accounts) return;

        return [...modified_accounts].sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (a.currency_config?.is_crypto !== b.currency_config?.is_crypto) {
                return a.currency_config?.is_crypto ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });
    }, [modified_accounts]);

    return {
        /** The list of wallet accounts for the current user. */
        data: sorted_accounts,
        ...rest,
    };
};

export default useWalletAccountsList;
