import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
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

    const tradersHubV2Route = window.location.pathname === '/wallets/traders-hub';

    return (
        <div
            className={classNames('wallets-app', {
                'wallets-traders-hub-v2': tradersHubV2Route,
            })}
        >
            <div className='wallets-app' key={`wallets_app_${i18n.language}`}>
                <div className='wallets-modal-show-header-root' id='wallets_modal_show_header_root' />
                <Router />
                {isPanelOpen && <WalletLanguageSidePanel />}
            </div>
        </div>
    );
};

export default AppContent;
