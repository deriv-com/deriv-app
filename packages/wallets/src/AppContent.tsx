import React from 'react';
import { useAuthorize } from '@deriv/api';
import { Loader } from './components';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const { isLoading } = useAuthorize();

    if (isLoading) return <Loader />;

    return (
        <div className='wallets-app'>
            <Router />
        </div>
    );
};

export default AppContent;
