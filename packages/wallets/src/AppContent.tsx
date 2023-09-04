import React from 'react';
import WalletsCarousel from './components/WalletCarousel';
import WalletList from './components/WalletList';
import IcBrandDerivGo from './public/ic-brand-derivgo.svg';
import './app-content.scss';

const AppContent: React.FC = () => {
    return (
        <div>
            <div className='wallets-app-content-icon' />
            <IcBrandDerivGo width={25} height={25} />
            <WalletList />
            <WalletsCarousel />
        </div>
    );
};

export default AppContent;
