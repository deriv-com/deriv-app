import React from 'react';
import { DesktopWalletsList, DesktopWrapper, MobileWrapper, WalletsCarousel } from './components';
import './AppContent.scss';

const AppContent: React.FC = () => {
    return (
        <React.Fragment>
            <DesktopWrapper>
                <DesktopWalletsList />
            </DesktopWrapper>
            <MobileWrapper>
                <WalletsCarousel />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default AppContent;
