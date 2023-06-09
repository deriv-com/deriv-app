import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useWalletList = () => {
    const { client } = useStore();
    const { accounts, loginid, is_crypto } = client;
    const { data, ...reset } = useFetch('authorize', {
        payload: { authorize: accounts[loginid || ''].token },
        options: { enabled: Boolean(loginid) },
    });

    // @ts-expect-error Need to update @deriv/api-types to fix the TS error
    const wallets = data?.authorize?.account_list?.filter(account => account.account_category === 'wallet');
    const modified_wallets = wallets?.map(wallet => ({
        ...wallet,
        balance: 1000,
        landing_company_shortcode: wallet.landing_company_name,
    }));
    const sorted_wallets = modified_wallets?.sort((a, b) => {
        if (a.is_virtual !== b.is_virtual) {
            return a.is_virtual ? 1 : -1;
        } else if (is_crypto(a.currency) !== is_crypto(b.currency)) {
            return is_crypto(a.currency) ? 1 : -1;
        }

        return (a.currency || 'USD').localeCompare(b.currency || 'USD');
    });

    return {
        ...reset,
        data: sorted_wallets,
    };
};

export default useWalletList;
