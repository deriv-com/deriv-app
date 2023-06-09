import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer, useStore } from '@deriv/stores';
import WalletCardsCarousel from 'Components/wallet-cards-carousel';
import { fake_wallet_accounts, sortWalletAccounts } from '@deriv/shared';
import { useWalletAccounts } from '@deriv/hooks';
import './slick.scss';

// TODO: delete it after testing
type TProps = {
    show_test_wallets?: boolean;
};

const AccountWithWallets = observer(({ show_test_wallets = false }: TProps) => {
    const {
        ui: { is_mobile },
    } = useStore();

    const wallet_accounts = useWalletAccounts();

    // TODO: We have to create ONE type for desktop and responsive wallet!!!
    const wallets_to_show: typeof wallet_accounts[] = show_test_wallets
        ? sortWalletAccounts(fake_wallet_accounts)
        : wallet_accounts;

    const [selected_wallet, setSelectedWallet] = React.useState<string>(
        wallets_to_show.length ? wallets_to_show[0].loginid : ''
    );

    const desktop_wallets_component = wallets_to_show.map(wallet => {
        const handleFn = React.useCallback(
            () => setSelectedWallet(selected_id => (selected_id === wallet.loginid ? '' : wallet.loginid)),
            [wallet.loginid]
        );

        return (
            <Wallet
                key={wallet.loginid}
                wallet_account={wallet}
                is_open_wallet={selected_wallet === wallet.loginid}
                setIsOpenWallet={handleFn}
            />
        );
    });

    return (
        <React.Fragment>
            {is_mobile ? <WalletCardsCarousel items={wallets_to_show} /> : desktop_wallets_component}
        </React.Fragment>
    );
});

export default AccountWithWallets;
