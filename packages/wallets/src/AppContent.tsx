import React from 'react';
import AddMoreWalletsCarousel from './components/AddMoreWalletsCarousel';
import IcBrandDerivGo from './public/ic-brand-derivgo.svg';
import { DesktopWalletsList } from './components';
import './AppContent.scss';

const AppContent: React.FC = () => {
    return (
        <div className='wallets-app'>
            <div className='wallets-app__content'>
                <DesktopWalletsList />
                <div className='wallet-app-content-icon' />
                <IcBrandDerivGo width={25} height={25} />
                <AddMoreWalletsCarousel />
            </div>
        </div>
    );
};

export default AppContent;
