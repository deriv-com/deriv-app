import React from 'react';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    return (
        <div className='wallets-app'>
            <div id='wallets_modal_responsive_root' className='wallets-modal-responsive-root'></div>
            <Router />
        </div>
    );
};

export default AppContent;
