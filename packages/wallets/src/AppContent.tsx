import React from 'react';
import WalletList from './components/WalletList';
import WalletsCarousel from './components/WalletCarousel';
import AddMoreWalletsCarousel from './components/AddMoreWalletsCarousel';

const AppContent: React.FC = () => {
    return (
        <div>
            <WalletList />
            <WalletsCarousel />
            <AddMoreWalletsCarousel />
        </div>
    );
};

export default AppContent;
