import React from 'react';
import { useAuthorize, useCurrencyConfig } from '@deriv/api';
import { Loader } from './components';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const { isLoading: isAuthorizeLoading } = useAuthorize();
    const { isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    if (isAuthorizeLoading || isCurrencyConfigLoading) return <Loader />;

    return (
        <div className='wallets-app'>
            <Router />
        </div>
    );
};

export default AppContent;
