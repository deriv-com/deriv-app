import React from 'react';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    return (
        <div className='wallets-app'>
            <Router />
        </div>
    );
};

export default AppContent;
