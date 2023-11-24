import React from 'react';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    return (
        <div className='wallets-app'>
            <div className='wallets-modal-show-header-root' id='wallets_modal_show_header_root' />
            <Router />
        </div>
    );
};

export default AppContent;
