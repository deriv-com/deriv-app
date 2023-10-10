import React, { useEffect } from 'react';
import { observer, useStore } from '@deriv/stores';
import { ThemedScrollbars, Loading } from '@deriv/components';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/hooks';
import AddMoreWallets from 'Components/add-more-wallets';
import ModalManager from 'Components/modals/modal-manager';
import DesktopWalletsList from './desktop-wallets-list';
import MobileWalletsCarousel from './mobile-wallets-carousel';
import WalletTourGuide from 'Modules/tour-guide/wallet-tour-guide';
import './wallets.scss';

const Wallets = observer(() => {
    const { client, ui } = useStore();
    const { switchAccount, is_authorize } = client;
    const { is_mobile } = ui;
    const { data: wallets_list } = useWalletAccountsList();
    const active_wallet = useActiveWalletAccount();

    useEffect(() => {
        if (!active_wallet && wallets_list.length) {
            const active_linked_account_wallet = wallets_list.find(wallet => wallet.is_linked_account_active);
            if (active_linked_account_wallet) {
                switchAccount(active_linked_account_wallet.loginid);
            } else {
                switchAccount(wallets_list[0].loginid);
            }
        }
    }, [active_wallet, wallets_list, switchAccount]);

    if (!is_authorize) return <Loading is_fullscreen />;

    return (
        <ThemedScrollbars className='wallets-module' is_scrollbar_hidden>
            <div className='wallets-module__content'>
                {is_mobile ? <MobileWalletsCarousel /> : <DesktopWalletsList />}
                <AddMoreWallets />
            </div>
            <ModalManager />
            <WalletTourGuide />
        </ThemedScrollbars>
    );
});

export default Wallets;
