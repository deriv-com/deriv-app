import React from 'react';
import WalletsCarousel from './components/WalletCarousel';
import WalletList from './components/WalletList';

const AppContent: React.FC = () => {
    return (
        <div>
            <WalletList />
            <WalletsCarousel />
        </div>
    );
};

export default AppContent;
