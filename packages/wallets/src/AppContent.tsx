import React from 'react';
import { DesktopWalletsList, WalletsCarousel } from './components';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const mobile_width = 768;

    //Temporary solution until we have a proper mobile view
    const is_mobile = window.innerWidth <= mobile_width;
    if (is_mobile) return <WalletsCarousel />;

    return (
        <div className='wallets-app'>
            <div className='wallets-app__content'>{!is_mobile && <DesktopWalletsList />}</div>
        </div>
    );
};

export default AppContent;
