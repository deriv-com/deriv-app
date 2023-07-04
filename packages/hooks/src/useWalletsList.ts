import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useWalletList = () => {
    const { client, ui } = useStore();
    const { accounts, loginid, is_crypto } = client;
    const { is_dark_mode_on } = ui;
    const { data, ...reset } = useFetch('authorize', {
        payload: { authorize: accounts[loginid || ''].token },
        options: { enabled: Boolean(loginid), keepPreviousData: true },
    });
    const { data: balance_data } = useFetch('balance', { payload: { account: 'all' } });

    const sortedWallets = useMemo(() => {
        // @ts-expect-error Need to update @deriv/api-types to fix the TS error
        // Filter out accounts which has account_category as wallet
        const wallets = data?.authorize?.account_list?.filter(account => account.account_category === 'wallet');

        // Modify the wallets to include the missing balance from the API response
        // Should remove this once the API is fixed
        const modified_wallets = wallets?.map(wallet => ({
            ...wallet,
            balance: 1000,
            gradient_header_class: `wallet-header__${
                wallet.is_virtual === 1 ? 'demo' : wallet.currency?.toLowerCase()
            }-bg${is_dark_mode_on ? '--dark' : ''}`,
            gradient_card_class: `wallet-card__${wallet.is_virtual === 1 ? 'demo' : wallet.currency?.toLowerCase()}-bg${
                is_dark_mode_on ? '--dark' : ''
            }`,
            landing_company_shortcode: wallet.landing_company_name,
        }));

        // Sort the wallets alphabetically by fiat, crypto, then virtual
        return modified_wallets?.sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (is_crypto(a.currency) !== is_crypto(b.currency)) {
                return is_crypto(a.currency) ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });
    }, [data, is_crypto, is_dark_mode_on]);

    return {
        ...reset,
        data: sortedWallets,
    };
};

export default useWalletList;
