import React from 'react';
import WalletHeader from './components/WalletHeaderList';
// import WalletsCarousel from './components/WalletCarousel';
import './AppContent.scss';

const AppContent: React.FC = () => {
    return (
        <div className='app-content'>
            <div className='app-content__content'>
                <WalletHeader />
            </div>
            {/* <WalletsCarousel /> */}
        </div>
    );
};

export default AppContent;
