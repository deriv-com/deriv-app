import { useMemo } from 'react';
import useDerivAccountsList from './useDerivAccountsList';

/** A custom hook that gets the list of all wallet accounts for the current user. */
const useWalletAccountsList = () => {
    const { data: account_list_data, ...rest } = useDerivAccountsList();

    // Filter out non-wallet accounts.
    const filtered_accounts = useMemo(
        () => account_list_data?.filter(account => account.is_wallet),
        [account_list_data]
    );

    // Add additional information to each wallet account.
    const modified_accounts = useMemo(() => {
        return filtered_accounts?.map(wallet => {
            const wallet_currency_type = wallet.is_virtual ? 'Demo' : wallet.currency || '';
            const dtrade_loginid = wallet.linked_to?.find(account => account.platform === 'dtrade')?.loginid;

            return {
                ...wallet,
                /** Returns the wallet's currency type. ex: `Demo`, `USD`, etc. */
                wallet_currency_type,
                /** Landing company shortcode the account belongs to. */
                landing_company_name: wallet.landing_company_name?.replace('maltainvest', 'malta'),
                /** Indicating whether the wallet is a maltainvest wallet. */
                is_malta_wallet: wallet.landing_company_name === 'maltainvest',
                /** The DTrade account ID of this wallet */
                dtrade_loginid,
                /** Returns if the wallet is a crypto wallet. */
                is_crypto: wallet.currency_config?.is_crypto,
            } as const;
        });
    }, [filtered_accounts]);

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
