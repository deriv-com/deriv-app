import React, { useEffect } from 'react';
import { observer, useStore } from '@deriv/stores';
import { ThemedScrollbars } from '@deriv/components';
import { useActiveWallet, useWalletsList } from '@deriv/hooks';
import AddMoreWallets from 'Components/add-more-wallets';
import ModalManager from 'Components/modals/modal-manager';
import DesktopWalletsList from './desktop-wallets-list';
import MobileWalletsCarousel from './mobile-wallets-carousel';
import WalletTourGuide from 'Modules/tour-guide/wallet-tour-guide';
import './wallets.scss';

const Wallets = observer(() => {
    const { client, ui } = useStore();
    const { switchAccount } = client;
    const { is_mobile } = ui;
    const { data } = useWalletsList();
    const active_wallet = useActiveWallet();

    useEffect(() => {
        if (!active_wallet && data?.[0]?.loginid) {
            switchAccount(data[0].loginid);
        }
    }, [active_wallet, data, switchAccount]);

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
