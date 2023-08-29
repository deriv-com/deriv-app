import React from 'react';
import WalletList from './components/WalletList';
import WalletsCarousel from './components/WalletCarousel';

const AppContent: React.FC = () => {
    return (
        <div>
            <WalletList />
            <WalletsCarousel />
        </div>
    );
};

export default AppContent;
