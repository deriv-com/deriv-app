import React from 'react';
import { useAuthorize } from '@deriv/api';
import WalletsAddMore from './components/WalletsAddMoreCarousel';
import useDevice from './hooks/useDevice';
import { DesktopWalletsList, Loader, WalletsCarousel } from './components';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const { is_mobile } = useDevice();
    const { isLoading } = useAuthorize();

    if (isLoading) return <Loader />;

    return (
        <div className='wallets-app'>
            <div className='wallets-app__content'>{is_mobile ? <WalletsCarousel /> : <DesktopWalletsList />}</div>
            <WalletsAddMore />
        </div>
    );
};

export default AppContent;
