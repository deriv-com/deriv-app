import React from 'react';
import { useAuthorize } from '@deriv/api';
import WalletsCarousel from './components/WalletsCarousel';
import { DesktopWalletsList } from './components';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const { isLoading } = useAuthorize();

    if (isLoading) return <h1>Authorizing...</h1>;

    return (
        <div className='wallets-app'>
            <div className='wallets-app__content'>
                <DesktopWalletsList />
                {/* <WalletsCarousel /> */}
            </div>
        </div>
    );
};

export default AppContent;
