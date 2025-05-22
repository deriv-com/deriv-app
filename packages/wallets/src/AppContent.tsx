import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount, useDerivAccountsList, useIsEuRegion, useSettings } from '@deriv/api-v2';
import { Analytics } from '@deriv-com/analytics';
import useAllBalanceSubscription from './hooks/useAllBalanceSubscription';
import { defineViewportHeight } from './utils/utils';
import { Router } from './routes';
import { TLanguageType } from './types';
import './AppContent.scss';

type AppContentProps = {
    isHubRedirectionEnabled: boolean;
    isWalletsOnboardingTourGuideVisible: boolean;
    setPreferredLanguage: (language: TLanguageType | null) => void;
};

const AppContent: React.FC<AppContentProps> = ({
    isHubRedirectionEnabled,
    isWalletsOnboardingTourGuideVisible,
    setPreferredLanguage,
}) => {
    const { isSubscribed, subscribeToAllBalance, unsubscribeFromAllBalance } = useAllBalanceSubscription();
    const { data: derivAccountList } = useDerivAccountsList();
    const previousDerivAccountListLengthRef = useRef(0);
    const appRef = useRef<HTMLDivElement>(null);
    const { data: isEuRegion } = useIsEuRegion();
    const { data: activeWallet } = useActiveWalletAccount();
    const {
        data: { preferred_language: preferredLanguage },
    } = useSettings();

    useEffect(() => {
        if (preferredLanguage) {
            setPreferredLanguage(preferredLanguage as TLanguageType);
        } else {
            setPreferredLanguage(null);
        }
    }, [preferredLanguage, setPreferredLanguage]);

    useEffect(() => {
        if (!derivAccountList?.length) return;
        if (previousDerivAccountListLengthRef.current !== derivAccountList.length || !isSubscribed) {
            subscribeToAllBalance();
            previousDerivAccountListLengthRef.current = derivAccountList.length;
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

    // Scroll to top when the onboarding tour guide is not visible
    useEffect(() => {
        if (!isWalletsOnboardingTourGuideVisible) {
            appRef.current?.scrollTo({
                behavior: 'smooth',
                top: 0,
            });
        }
    }, [isWalletsOnboardingTourGuideVisible]);

    return (
        <div
            className={classNames('wallets-app', {
                'wallets-app--with-banner': isEuRegion && !activeWallet?.is_virtual,
            })}
            ref={appRef}
        >
            <div className='wallets-modal-show-header-root' id='wallets_modal_show_header_root' />
            <Router isHubRedirectionEnabled={isHubRedirectionEnabled} />
        </div>
    );
};

export default AppContent;
