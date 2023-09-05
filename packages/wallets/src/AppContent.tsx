import React from 'react';
import { DesktopWalletsList, DesktopWrapper, MobileWrapper, WalletsCarousel } from './components';
import './AppContent.scss';

const AppContent: React.FC = () => {
    return (
        <div className='wallets-app'>
            <div className='wallets-app__content'>
                <DesktopWrapper>
                    <DesktopWalletsList />
                </DesktopWrapper>
                <MobileWrapper>
                    <WalletsCarousel />
                </MobileWrapper>
            </div>
        </div>
    );
};

export default AppContent;
