import React from 'react';
import WalletList from './components/WalletList';
import WalletsCarousel from './components/WalletCarousel';
import useDevice from './hooks/useDevice';
import './app-content.scss';

const AppContent: React.FC = () => {
    const { is_mobile } = useDevice();

    return <div>{is_mobile ? <WalletsCarousel /> : <WalletList />}</div>;
};

export default AppContent;
