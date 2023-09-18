import React from 'react';
import WalletsAddMore from './components/WalletsAddMoreCarousel';
import useDevice from './hooks/useDevice';
import { DesktopWalletsList, WalletsCarousel } from './components';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const { is_mobile } = useDevice();

    return (
        <div className='wallets-app'>
            <div className='wallets-app__content'>{is_mobile ? <WalletsCarousel /> : <DesktopWalletsList />}</div>
            <WalletsAddMore />
        </div>
    );
};

export default AppContent;
