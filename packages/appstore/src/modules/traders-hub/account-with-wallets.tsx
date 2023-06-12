import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer, useStore } from '@deriv/stores';
import WalletCardsCarousel from 'Components/wallet-cards-carousel';
import { useWalletsList } from '@deriv/hooks';
import { Loading } from '@deriv/components';
import { convertWallets } from 'Constants/utils';

const AccountWithWallets = observer(() => {
    const {
        ui: { is_mobile, is_dark_mode_on },
    } = useStore();

    const { data, isLoading } = useWalletsList();

    // TODO: We have to create ONE type for desktop and responsive wallet!!!
    const wallet_accounts = React.useMemo(() => convertWallets(data, is_dark_mode_on), [data, is_dark_mode_on]);

    const [selected_wallet, setSelectedWallet] = React.useState<NonNullable<typeof data>[number]['loginid']>(
        wallet_accounts.length ? wallet_accounts[0].loginid : undefined
    );

    const desktop_wallets_component = wallet_accounts.map(wallet => {
        const setIsOpenWallet = () =>
            setSelectedWallet(selected_id => (selected_id === wallet.loginid ? undefined : wallet.loginid));

        return (
            <Wallet
                key={wallet.loginid}
                wallet_account={wallet}
                is_open_wallet={selected_wallet === wallet.loginid}
                setIsOpenWallet={setIsOpenWallet}
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
