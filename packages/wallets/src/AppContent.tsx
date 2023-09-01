import React from 'react';
import { DesktopWalletsHeader } from './components';
// import WalletsCarousel from './components/WalletCarousel';
import './AppContent.scss';

const AppContent: React.FC = () => {
    return (
        <div className='app-content'>
            <div className='app-content__content'>
                <DesktopWalletsHeader />
            </div>
            {/* <WalletsCarousel /> */}
        </div>
    );
};

export default AppContent;
