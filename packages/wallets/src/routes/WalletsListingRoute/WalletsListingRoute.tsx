import React, { useEffect, useMemo } from 'react';
import { useActiveAccount, useActiveWalletAccount, useAuthorize, useWalletAccountsList } from '@deriv/api';
import { DesktopWalletsList, WalletsAddMoreCarousel, WalletsCarousel, WalletTourGuide } from '../../components';
import useDevice from '../../hooks/useDevice';
import './WalletsListingRoute.scss';

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();
    const { data: walletAccounts } = useWalletAccountsList();
    const { switchAccount } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: activeAccount } = useActiveAccount();

    const walletAccountToSwitchTo = useMemo(() => {
        const linkedWallet = walletAccounts?.find(
            account =>
                account?.linked_to?.find(linked => linked.platform === 'dtrade')?.loginid === activeAccount?.loginid
        );
        if (linkedWallet) {
            return linkedWallet.loginid;
        }
        return walletAccounts?.[0]?.loginid;
    }, [walletAccounts, activeAccount]);

    useEffect(() => {
        if (!activeWallet && walletAccountToSwitchTo) {
            switchAccount(walletAccountToSwitchTo);
        }
    }, [activeWallet, walletAccountToSwitchTo, switchAccount]);

    return (
        <div className='wallets-listing-route'>
            {isMobile ? <WalletsCarousel /> : <DesktopWalletsList />}
            <WalletsAddMoreCarousel />
            {!isMobile && <WalletTourGuide />}
        </div>
    );
};

export default WalletsListingRoute;
