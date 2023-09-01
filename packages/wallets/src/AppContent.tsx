import React from 'react';
import { useAuthorize } from '@deriv/api';
import WalletsCarousel from './components/WalletCarousel';
import WalletList from './components/WalletList';
// import IcBrandDerivGo from './public/ic-brand-derivgo.svg';
import './app-content.scss';

const AppContent: React.FC = () => {
    const { isSuccess } = useAuthorize();

    if (!isSuccess) return <p>authorizing...</p>;

    return (
        <div>
            <div className='wallet-app-content-icon' />
            {/* <IcBrandDerivGo width={25} height={25} /> */}
            <WalletList />
            <WalletsCarousel />
        </div>
    );
};

export default AppContent;
