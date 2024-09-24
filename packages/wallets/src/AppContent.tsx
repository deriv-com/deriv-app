import React, { useEffect, useRef } from 'react';
import { useDerivAccountsList } from '@deriv/api-v2';
import { Analytics } from '@deriv-com/analytics';
import { getInitialLanguage, useTranslations } from '@deriv-com/translations';
import useAllBalanceSubscription from './hooks/useAllBalanceSubscription';
import { defineViewportHeight } from './utils/utils';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const { isSubscribed, subscribeToAllBalance, unsubscribeFromAllBalance } = useAllBalanceSubscription();
    const { data: derivAccountList } = useDerivAccountsList();
    const { switchLanguage } = useTranslations();
    const previousDerivAccountListLenghtRef = useRef(0);
    const currentLanguage = localStorage.getItem('i18n_language') ?? getInitialLanguage();

    useEffect(() => {
        if (!derivAccountList?.length) return;
        if (previousDerivAccountListLenghtRef.current !== derivAccountList.length || !isSubscribed) {
            subscribeToAllBalance();
            previousDerivAccountListLenghtRef.current = derivAccountList.length;
        }
        return () => {
            if (isSubscribed) {
                unsubscribeFromAllBalance();
            }
        };
    }, [derivAccountList?.length, isSubscribed, subscribeToAllBalance, unsubscribeFromAllBalance]);

    useEffect(() => {
        defineViewportHeight();
    }, []);

    useEffect(() => {
        Analytics.trackEvent('ce_wallets_homepage_form', {
            action: 'open',
            form_name: 'ce_wallets_homepage_form',
        });
    }, []);

    useEffect(() => {
        switchLanguage(currentLanguage);
    }, [currentLanguage, switchLanguage]);

    return (
        <div className='wallets-app'>
            <div className='wallets-modal-show-header-root' id='wallets_modal_show_header_root' />
            <Router />
        </div>
    );
};

export default AppContent;
