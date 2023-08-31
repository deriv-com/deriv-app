import React from 'react';
import WalletList from './components/WalletList';
import WalletsCarousel from './components/WalletsCarousel';
import IcBrandDerivGo from './public/ic-brand-derivgo.svg';
import './app-content.scss';

const AppContent: React.FC = () => {
    return (
        <div>
            <div className='icon' />
            <IcBrandDerivGo width={25} height={25} />
            <WalletList />
            <WalletsCarousel />
        </div>
    );
};

export default AppContent;
