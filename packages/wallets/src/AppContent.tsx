import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Analytics } from '@deriv-com/analytics';
import { defineViewportHeight } from './utils/utils';
import { WalletLanguageSidePanel } from './components';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const { i18n } = useTranslation();

    useEffect(() => {
        const handleShortcutKey = (event: globalThis.KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'p') {
                setIsPanelOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleShortcutKey);

        return () => {
            window.removeEventListener('keydown', handleShortcutKey);
        };
    }, [setIsPanelOpen]);

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
        <div className='wallets-app' key={`wallets_app_${i18n.language}`}>
            <div className='wallets-modal-show-header-root' id='wallets_modal_show_header_root' />
            <Router />
            {isPanelOpen && <WalletLanguageSidePanel />}
        </div>
    );
};

export default AppContent;
