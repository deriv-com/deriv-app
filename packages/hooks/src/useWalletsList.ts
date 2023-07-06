import { useMemo } from 'react';
import { useStore } from '@deriv/stores';
import { getWalletCurrencyIcon } from '@deriv/utils';
import { useFetch } from '@deriv/api';
import useAuthorize from './useAuthorize';

const useWalletsList = () => {
    const { client, ui } = useStore();
    const { loginid, is_crypto } = client;
    const { is_dark_mode_on } = ui;
    const { data, ...rest } = useAuthorize();

    const { data: balance_data } = useFetch('balance', { payload: { account: 'all' } });

    const sortedWallets = useMemo(() => {
        // Filter out accounts which has account_category as wallet
        const wallets = data?.authorize?.account_list?.filter(account => account.account_category === 'wallet');

        // Modify the wallets to include the missing balance from the API response
        const modified_wallets =
            wallets?.map(wallet => {
                const wallet_currency = wallet?.currency || '';
                const is_crypto_currency = is_crypto(wallet_currency);

                return {
                    ...wallet,
                    currency: wallet_currency,
                    /** Indicating whether the wallet is the currently selected wallet. */
                    is_selected: wallet.loginid === loginid,
                    /** Indicating whether the wallet is a virtual-money wallet. */
                    is_demo: wallet.is_virtual === 1,
                    /** Wallet balance */
                    balance: balance_data?.balance?.accounts?.[wallet.loginid || '']?.balance || 0,
                    /** Landing company shortcode the account belongs to. */
                    landing_company_name:
                        wallet.landing_company_name === 'maltainvest' ? 'malta' : wallet.landing_company_name,

                    is_malta_wallet: wallet.landing_company_name === 'malta',
                    gradient_header_class: `wallet-header__${
                        wallet.is_virtual === 1 ? 'demo' : wallet.currency?.toLowerCase()
                    }-bg${is_dark_mode_on ? '--dark' : ''}`,
                    gradient_card_class: `wallet-card__${
                        wallet.is_virtual === 1 ? 'demo' : wallet.currency?.toLowerCase()
                    }-bg${is_dark_mode_on ? '--dark' : ''}`,
                    is_disabled: Boolean(wallet.is_disabled),
                    is_virtual: Boolean(wallet.is_virtual),
                    is_crypto: is_crypto_currency,
                    icon: getWalletCurrencyIcon(wallet.is_virtual ? 'demo' : wallet_currency, is_dark_mode_on),
                    modal_icon: getWalletCurrencyIcon(
                        wallet.is_virtual ? 'demo' : wallet_currency,
                        is_dark_mode_on,
                        true
                    ),
                    name: `${wallet.is_virtual ? 'Demo ' : ''}${wallet_currency} ${'Wallet'}`,
                    // needs for WalletIcon, maybe refactor during cleanUp
                    icon_type: !is_crypto_currency && !wallet.is_virtual ? 'fiat' : 'crypto',
                    is_added: true,
                };
            }) || [];

        // Sort the wallets alphabetically by fiat, crypto, then virtual
        return modified_wallets?.sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (is_crypto(a.currency) !== is_crypto(b.currency)) {
                return is_crypto(a.currency) ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });
    }, [data?.authorize?.account_list, is_crypto, loginid, balance_data?.balance?.accounts, is_dark_mode_on]);

    return {
        ...rest,
        data: sortedWallets,
    };
};

export default useWalletsList;
