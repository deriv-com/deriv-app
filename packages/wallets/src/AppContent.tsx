import React from 'react';
import { DesktopWalletsHeader } from './components';
// import WalletsCarousel from './components/WalletCarousel';
import './AppContent.scss';

const AppContent: React.FC = () => {
    return (
        <div className='wallet-app'>
            <div className='wallet-app__content'>
                <DesktopWalletsHeader />
            </div>
            {/* <WalletsCarousel /> */}
        </div>
    );
};

export default AppContent;
