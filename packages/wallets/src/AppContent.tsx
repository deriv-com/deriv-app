import React from 'react';
import { DesktopWalletsList } from './components';
// import WalletsCarousel from './components/WalletCarousel';
import './AppContent.scss';

const AppContent: React.FC = () => {
    return (
        <div className='wallets-app'>
            <div className='wallets-app__content'>
                <DesktopWalletsList />
            </div>
            {/* <WalletsCarousel /> */}
        </div>
    );
};

export default AppContent;
