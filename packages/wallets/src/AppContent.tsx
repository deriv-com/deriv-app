import React from 'react';
import { useAuthorize } from '@deriv/api';
import useCashierParam from './hooks/useCashierParam';
import useDevice from './hooks/useDevice';
import { DesktopWalletsList, Loader, WalletCashier, WalletsAddMoreCarousel, WalletsCarousel } from './components';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const { activeCashierTab } = useCashierParam();
    const { is_mobile } = useDevice();
    const { isLoading } = useAuthorize();

    if (isLoading) return <Loader />;

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
