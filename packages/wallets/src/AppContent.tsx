import React from 'react';
import { useAuthorize, useCurrencyConfig } from '@deriv/api';
import WalletsAddMore from './components/WalletsAddMoreCarousel';
import useDevice from './hooks/useDevice';
import { DesktopWalletsList, WalletsCarousel } from './components';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const { is_mobile } = useDevice();
    const { isLoading: is_authorize_loading } = useAuthorize();
    const { isLoading: is_current_currency_loading } = useCurrencyConfig();

    if (is_authorize_loading || is_current_currency_loading) return <h1>Loading...</h1>;

    return (
        <div className='wallets-app'>
            <div className='wallets-app__content'>{is_mobile ? <WalletsCarousel /> : <DesktopWalletsList />}</div>
            <WalletsAddMore />
        </div>
    );
};

export default AppContent;
