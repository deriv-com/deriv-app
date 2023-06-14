import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useWalletList = () => {
    const { client } = useStore();
    const { accounts, loginid, is_crypto } = client;
    const { data, ...reset } = useFetch('authorize', {
        payload: { authorize: accounts[loginid || ''].token },
        options: { enabled: Boolean(loginid) },
    });

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

    // // TODO: delete it when wallets API starts to work
    // const fake_wallet_accounts: any[] = [
    //     {
    //         name: 'USD',
    //         currency: 'USD',
    //         icon: getWalletCurrencyIcon('USD', false),
    //         balance: '10,784',
    //         icon_type: 'fiat',
    //         landing_company_shortcode: 'svg',
    //         is_disabled: false,
    //         is_virtual: false,
    //         loginid: 'CRW10001',
    //     },
    //     {
    //         name: 'Demo USD',
    //         currency: 'USD',
    //         icon: getWalletCurrencyIcon('demo', false),
    //         balance: '10,0000',
    //         icon_type: 'fiat',
    //         landing_company_shortcode: 'svg',
    //         is_disabled: false,
    //         is_virtual: true,
    //         loginid: 'CRW10002',
    //     },
    //     {
    //         name: 'AUD',
    //         currency: 'AUD',
    //         icon: getWalletCurrencyIcon('AUD', false),
    //         balance: '5,374',
    //         icon_type: 'fiat',
    //         landing_company_shortcode: 'svg',
    //         is_disabled: false,
    //         is_virtual: false,
    //         loginid: 'CRW10001',
    //     },
    //     {
    //         name: 'Bitcoin',
    //         currency: 'BTC',
    //         icon: getWalletCurrencyIcon('BTC', false),
    //         balance: '2.34',
    //         icon_type: 'crypto',
    //         landing_company_shortcode: 'svg',
    //         is_disabled: false,
    //         is_virtual: false,
    //         loginid: 'CRW10001',
    //     },
    //     {
    //         name: 'EUR',
    //         currency: 'EUR',
    //         balance: '10,784.73',
    //         icon_type: 'fiat',
    //         landing_company_shortcode: 'malta',
    //         icon: getWalletCurrencyIcon('EUR', false),
    //         is_disabled: false,
    //         is_virtual: false,
    //         loginid: 'CRW10001',
    //     },
    //     {
    //         name: 'USD',
    //         currency: 'USD',
    //         balance: '3,231.05',
    //         icon_type: 'fiat',
    //         landing_company_shortcode: 'malta',
    //         icon: getWalletCurrencyIcon('USD', false),
    //         is_disabled: false,
    //         is_virtual: false,
    //         loginid: 'MFW10005',
    //     },
    //     {
    //         name: 'ETH',
    //         currency: 'ETH',
    //         balance: '0.012342',
    //         icon_type: 'crypto',
    //         landing_company_shortcode: 'svg',
    //         icon: getWalletCurrencyIcon('ETH', false),
    //         is_disabled: false,
    //         is_virtual: false,
    //         loginid: 'CRW10007',
    //     },
    //     {
    //         name: 'LTC',
    //         currency: 'LTC',
    //         balance: '1.2342',
    //         icon_type: 'crypto',
    //         landing_company_shortcode: 'svg',
    //         icon: getWalletCurrencyIcon('LTC', false),
    //         is_disabled: false,
    //         is_virtual: false,
    //         loginid: 'CRW10007',
    //     },
    //     {
    //         name: 'USDC',
    //         currency: 'USDC',
    //         balance: '3.064',
    //         icon_type: 'crypto',
    //         landing_company_shortcode: 'svg',
    //         icon: getWalletCurrencyIcon('USDC', false),
    //         is_disabled: false,
    //         is_virtual: false,
    //         loginid: 'CRW10008',
    //     },
    //     {
    //         name: 'USDT',
    //         currency: 'USDT',
    //         balance: '1.064',
    //         icon_type: 'crypto',
    //         landing_company_shortcode: 'svg',
    //         icon: getWalletCurrencyIcon('USDT', false),
    //         is_disabled: false,
    //         is_virtual: false,
    //         loginid: 'CRW10009',
    //     },
    //     {
    //         name: 'eUSDT',
    //         currency: 'eUSDT',
    //         balance: '5.034',
    //         icon_type: 'crypto',
    //         landing_company_shortcode: 'svg',
    //         icon: getWalletCurrencyIcon('eUSDT', false),
    //         is_disabled: false,
    //         is_virtual: false,
    //         loginid: 'CRW10010',
    //     },
    //     {
    //         name: 'tUSDT',
    //         currency: 'tUSDT',
    //         balance: '0.111',
    //         icon_type: 'crypto',
    //         landing_company_shortcode: 'svg',
    //         icon: getWalletCurrencyIcon('tUSDT', false),
    //         is_disabled: false,
    //         is_virtual: false,
    //         loginid: 'CRW10011',
    //     },
    // ];

    return {
        ...reset,
        data: sortedWallets,
    };
};

export default useWalletList;
