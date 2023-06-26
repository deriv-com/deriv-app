import { useMemo } from 'react';
import { useStore } from '@deriv/stores';
import useAuthorize from './useAuthorize';

const useWalletList = () => {
    const { client } = useStore();
    const { is_crypto } = client;
    const { data, ...rest } = useAuthorize();

    const sortedWallets = useMemo(() => {
        // @ts-expect-error Need to update @deriv/api-types to fix the TS error
        // Filter out accounts which has account_category as wallet
        const wallets = data?.authorize?.account_list?.filter(account => account.account_category === 'wallet');

        // Modify the wallets to include the missing balance from the API response
        // Should remove this once the API is fixed
        const modified_wallets = wallets?.map(wallet => ({
            ...wallet,
            balance: 1000,
            landing_company_shortcode: wallet.landing_company_name,
            is_added: true,
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
    }, [data, is_crypto]);

    return {
        ...rest,
        data: sortedWallets,
    };
};

export default useWalletList;
