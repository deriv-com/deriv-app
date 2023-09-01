import React from 'react';
import { useAuthorize } from '@deriv/api';
import WalletsCarousel from './components/WalletCarousel';
import WalletList from './components/WalletList';
import Ictest from './public/ic-test.svg';
import './app-content.scss';

const AppContent: React.FC = () => {
    const { isSuccess } = useAuthorize();

    if (!isSuccess) return <p>authorizing...</p>;

    return (
        <div>
            <div className='wallets-app-content-icon' />
            <Ictest width={25} height={25} />
            <WalletList />
            <WalletsCarousel />
        </div>
    );
};

export default AppContent;
