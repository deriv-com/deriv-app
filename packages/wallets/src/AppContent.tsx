import React from 'react';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    return (
        <div className='wallets-app'>
            <div className='wallets-modal-responsive-root' id='wallets_modal_responsive_root' />
            <Router />
        </div>
    );
};

export default AppContent;
