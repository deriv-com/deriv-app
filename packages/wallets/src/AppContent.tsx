import React from 'react';
import useDevice from './hooks/useDevice';
import { DesktopWalletsList, WalletsCarousel } from './components';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const { is_mobile } = useDevice();

    if (is_mobile) return <WalletsCarousel />;

    return (
        <div className='wallets-app'>
            <div className='wallets-app__content'>{!is_mobile && <DesktopWalletsList />}</div>
        </div>
    );
};

export default AppContent;
