import React from 'react';
import { useAuthorize } from '@deriv/api';
import useDevice from './hooks/useDevice';
import { DesktopWalletsList, Loader, WalletCashier, WalletsAddMoreCarousel, WalletsCarousel } from './components';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const { is_mobile } = useDevice();
    const { isLoading } = useAuthorize();

    if (isLoading) return <Loader />;

    const urlParams = new URLSearchParams(window.location.search);
    const activeCashierTab = urlParams.get('active-cashier-tab');

    if (activeCashierTab) {
        return <WalletCashier />;
    }

    return (
        <div className='wallets-app'>
            <div className='wallets-app__content'>{is_mobile ? <WalletsCarousel /> : <DesktopWalletsList />}</div>
            <WalletsAddMoreCarousel />
        </div>
    );
};

export default AppContent;
