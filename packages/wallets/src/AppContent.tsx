import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthorize, useBalanceSubscription } from '@deriv/api-v2';
import useSubscribedBalance from './hooks/useSubscribedBalance';
import { defineViewportHeight } from './utils/utils';
import { WalletLanguageSidePanel } from './components';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const { i18n } = useTranslation();
    const { data: balanceData, isSubscribed, subscribe, unsubscribe, ...rest } = useBalanceSubscription();
    const { isSuccess } = useAuthorize();
    const { setBalanceData } = useSubscribedBalance();

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
        if (!isSuccess) return;
        if (isSubscribed) unsubscribe();
        subscribe({
            account: 'all',
        });
        return () => {
            if (isSubscribed) unsubscribe();
        };
    }, [balanceData, isSubscribed, isSuccess, subscribe, unsubscribe]);

    useEffect(() => {
        setBalanceData({ data: balanceData, ...rest });
    }, [balanceData, rest, setBalanceData]);

    return (
        <div className='wallets-app' key={`wallets_app_${i18n.language}`}>
            <div className='wallets-modal-show-header-root' id='wallets_modal_show_header_root' />
            <Router />
            {isPanelOpen && <WalletLanguageSidePanel />}
        </div>
    );
};

export default AppContent;
