import React from 'react';
import WalletsCarousel from './components/WalletCarousel';

const AppContent: React.FC = () => {
    return (
        <div
            style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '100%',
                fontSize: 30,
            }}
        >
            <WalletsCarousel />
        </div>
    );
};

export default AppContent;
