import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import {
    useActiveWalletAccount,
    useDerivAccountsList,
    useIsEuRegion,
    useSettings,
    useGrowthbookGetFeatureValue,
    useClientCountry,
} from '@deriv/api-v2';
import { Analytics } from '@deriv-com/analytics';
import useAllBalanceSubscription from './hooks/useAllBalanceSubscription';
import { defineViewportHeight } from './utils/utils';
import { Router } from './routes';
import { TLanguageType } from './types';
import './AppContent.scss';

type AppContentProps = {
    isWalletsOnboardingTourGuideVisible: boolean;
    setPreferredLanguage: (language: TLanguageType | null) => void;
};

type THubEnabledCountryList = {
    hub_enabled_country_list: string[];
};

const AppContent: React.FC<AppContentProps> = ({ isWalletsOnboardingTourGuideVisible, setPreferredLanguage }) => {
    const { isSubscribed, subscribeToAllBalance, unsubscribeFromAllBalance } = useAllBalanceSubscription();
    const { data: derivAccountList } = useDerivAccountsList();
    const previousDerivAccountListLengthRef = useRef(0);
    const appRef = useRef<HTMLDivElement>(null);
    const { data: isEuRegion } = useIsEuRegion();
    const { data: activeWallet } = useActiveWalletAccount();
    const {
        data: { citizen, preferred_language: preferredLanguage, trading_hub: tradingHub },
    } = useSettings();
    const { data: clientCountry } = useClientCountry();
    const [hubEnabledCountryList] = useGrowthbookGetFeatureValue({
        featureFlag: 'hub_enabled_country_list',
    });

    const PRODUCTION_URL = 'app.deriv.com';
    const PRODUCTION_REDIRECT_URL = 'https://hub.deriv.com/tradershub/options';
    const STAGING_REDIRECT_URL = 'https://staging-hub.deriv.com/tradershub/options';

    const isGBValueRedirectToHub =
        typeof hubEnabledCountryList === 'object' &&
        hubEnabledCountryList !== null &&
        Array.isArray((hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list) &&
        ((citizen && (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(citizen)) ||
            (clientCountry &&
                (hubEnabledCountryList as THubEnabledCountryList).hub_enabled_country_list.includes(clientCountry)));

    useEffect(() => {
        if (isGBValueRedirectToHub && !!tradingHub) {
            const redirectUrl =
                window.location.hostname === PRODUCTION_URL ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;
            window.location.assign(redirectUrl);
        }
    }, [isGBValueRedirectToHub, tradingHub]);

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
            <Router />
        </div>
    );
};

export default AppContent;
