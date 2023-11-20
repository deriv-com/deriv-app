import React, { useEffect } from 'react';
import { defineViewportVh } from './utils/utils';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    useEffect(() => {
        defineViewportVh();
        window.addEventListener('resize', defineViewportVh);
        return () => window.removeEventListener('resize', defineViewportVh);
    }, []);

    return (
        <div className='wallets-app'>
            <div className='wallets-modal-show-header-root' id='wallets_modal_show_header_root' />
            <Router />
        </div>
    );
};

export default AppContent;
