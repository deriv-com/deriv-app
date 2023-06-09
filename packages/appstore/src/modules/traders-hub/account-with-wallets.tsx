import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer, useStore } from '@deriv/stores';
import WalletCardsCarousel from 'Components/wallet-cards-carousel';
import { useWalletsList } from '@deriv/hooks';
import { isCryptocurrency, getWalletCurrencyIcon } from '@deriv/shared';
import { Loading } from '@deriv/components';
import './slick.scss';

const AccountWithWallets = observer(() => {
    const {
        ui: { is_mobile, is_dark_mode_on },
    } = useStore();

    const { data, isLoading } = useWalletsList();

    // TODO: We have to create ONE type for desktop and responsive wallet!!!
    const wallet_accounts =
        data?.map(wallet => {
            const {
                currency = 'USD',
                account_category,
                account_type,
                balance = 0,
                is_disabled,
                is_virtual,
                landing_company_shortcode,
                loginid,
            } = wallet;

            const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';
            const name = is_virtual ? `Demo ${currency}` : currency;

            return {
                account_category,
                account_type,
                balance,
                currency,
                is_disabled: !!is_disabled,
                is_virtual: !!is_virtual,
                landing_company_shortcode,
                loginid,
                icon: getWalletCurrencyIcon(is_virtual ? 'demo' : currency, is_dark_mode_on),
                icon_type: is_fiat && !is_virtual ? 'fiat' : 'crypto',
                name,
            };
        }) || [];

    const [selected_wallet, setSelectedWallet] = React.useState<string>(
        wallet_accounts.length ? wallet_accounts[0]?.loginid : ''
    );

    const desktop_wallets_component = wallet_accounts.map(wallet => {
        // const handleFn = React.useCallback(
        //     () => setSelectedWallet(selected_id => (selected_id === wallet.loginid ? '' : wallet.loginid)),
        //     [wallet.loginid]
        // );

        const handleFn = () => setSelectedWallet(selected_id => (selected_id === wallet.loginid ? '' : wallet.loginid));

        return (
            <Wallet
                key={wallet.loginid}
                wallet_account={wallet}
                is_open_wallet={selected_wallet === wallet.loginid}
                setIsOpenWallet={handleFn}
            />
        );
    });

    if (isLoading) return <Loading is_fullscreen={false} />;

    return (
        <React.Fragment>
            {is_mobile ? <WalletCardsCarousel items={wallet_accounts} /> : desktop_wallets_component}
        </React.Fragment>
    );
});

export default AccountWithWallets;
