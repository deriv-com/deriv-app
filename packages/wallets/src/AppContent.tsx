import React, { useEffect } from 'react';
import { defineViewportHeight } from './utils/utils';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    useEffect(() => {
        defineViewportHeight();
    }, []);

    return (
        <div className='wallets-app'>
            <div className='wallets-modal-show-header-root' id='wallets_modal_show_header_root' />
            <Router />
        </div>
    );
};

export default AppContent;
