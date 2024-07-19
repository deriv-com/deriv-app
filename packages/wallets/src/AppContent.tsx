import React, { useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { defineViewportHeight } from './utils/utils';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    useEffect(() => {
        defineViewportHeight();
    }, []);

    useEffect(() => {
        // TODO: remove `@ts-expect-error` after @deriv-com/analytics version update
        //@ts-expect-error temporary suppress ts error until we update @deriv-com/analytics to the latest version
        Analytics.trackEvent('ce_wallets_homepage_form', {
            action: 'open',
            form_name: 'ce_wallets_homepage_form',
        });
    }, []);

    return (
        <div className='wallets-app'>
            <div className='wallets-modal-show-header-root' id='wallets_modal_show_header_root' />
            <Router />
        </div>
    );
};

export default AppContent;
