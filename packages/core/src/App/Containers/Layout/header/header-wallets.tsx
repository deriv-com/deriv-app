import React from 'react';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { useIsHubRedirectionEnabled } from '@deriv/hooks';
import { platforms, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';

import { MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { AccountActionsWallets } from 'App/Components/Layout/Header/wallets/account-actions-wallets';
import AccountsInfoLoaderWallets from 'App/Components/Layout/Header/wallets/accounts-info-loader-wallets';
import platform_config from 'App/Constants/platform-config';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';

import DerivShortLogo from './deriv-short-logo';
import TradersHubHomeButton from './traders-hub-home-button';

const MenuLeft = observer(() => {
    const { client, common, traders_hub, ui } = useStore();
    const { isDesktop } = useDevice();
    const { pathname } = useLocation();

    const { is_bot_allowed, is_logged_in, is_mt5_allowed, is_dxtrade_allowed } = client;
    const { app_routing_history, current_language } = common;
    const { setTogglePlatformType } = traders_hub;
    const { header_extension } = ui;

    const traders_hub_routes =
        [routes.traders_hub].includes(pathname) ||
        [routes.account, routes.wallets, routes.settings, routes.wallets_compare_accounts, routes.compare_cfds].some(
            route => pathname.startsWith(route)
        );

    const filterPlatformsForClients = (payload: typeof platform_config) =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            if (config.link_to === routes.dxtrade) {
                return is_dxtrade_allowed;
            }
            if (config.link_to === routes.bot || config.href === routes.smarttrader) {
                return is_bot_allowed;
            }
            return true;
        });

    return (
        <div className='header__menu-left'>
            {isDesktop ? (
                <React.Fragment>
                    <DerivShortLogo />
                    <div className='header__divider' />
                    <TradersHubHomeButton />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />
                    <DerivShortLogo />
                    {header_extension && is_logged_in && (
                        <div className='header__menu-left-extensions'>{header_extension}</div>
                    )}
                </React.Fragment>
            )}
            <MenuLinks is_traders_hub_routes={traders_hub_routes} />
            {isDesktop && !traders_hub_routes && (
                <PlatformSwitcher
                    app_routing_history={app_routing_history}
                    platform_config={filterPlatformsForClients(platform_config)}
                    setTogglePlatformType={setTogglePlatformType}
                    current_language={current_language}
                />
            )}
        </div>
    );
});

const MenuRight = observer(() => {
    const { pathname } = useLocation();
    const { client } = useStore();
    const { is_logged_in, is_logging_in, is_single_logging_in, is_switching, accounts, loginid } = client;
    const { isDesktop } = useDevice();

    const history = useHistory();

    const isRedirectPage = history.location.pathname.includes(routes.redirect);

    const traders_hub_routes =
        [routes.traders_hub].includes(pathname) ||
        [routes.account, routes.wallets, routes.settings, routes.wallets_compare_accounts, routes.compare_cfds].some(
            route => pathname.startsWith(route)
        );

    const active_account = accounts?.[loginid ?? ''];
    const currency = active_account?.currency ?? '';

    return (
        <div className='header__menu-right'>
            {is_logging_in || is_single_logging_in || is_switching || isRedirectPage ? (
                <div
                    id='dt_core_header_acc-info-preloader'
                    className={classNames('acc-info__preloader', {
                        'acc-info__preloader--no-currency': !currency,
                    })}
                >
                    <AccountsInfoLoaderWallets
                        is_logged_in={is_logged_in}
                        is_desktop={isDesktop}
                        is_traders_hub_routes={traders_hub_routes}
                        speed={3}
                    />
                </div>
            ) : (
                <div id={'dt_core_header_acc-info-container'} className='acc-info__container'>
                    <AccountActionsWallets is_traders_hub_routes={traders_hub_routes} />
                </div>
            )}
        </div>
    );
});

const HeaderWallets = observer(() => {
    const { client, common, ui, notifications } = useStore();
    const { has_wallet, is_client_store_initialized } = client;
    const { platform } = common;
    const { is_app_disabled, is_route_modal_on } = ui;
    const { addNotificationMessage, client_notifications, removeNotificationMessage } = notifications;
    const { isHubRedirectionEnabled, isHubRedirectionLoaded } = useIsHubRedirectionEnabled();

    const addUpdateNotification = () => addNotificationMessage(client_notifications.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

    React.useEffect(() => {
        document.addEventListener('IgnorePWAUpdate', removeUpdateNotification);
        return () => document.removeEventListener('IgnorePWAUpdate', removeUpdateNotification);
    }, [removeUpdateNotification]);

    const excludedRoutes = [
        routes.trade,
        routes.trader_positions,
        routes.complaints_policy,
        routes.endpoint,
        routes.redirect,
        routes.index,
        routes.error404,
    ];

    const isExcludedRoute = excludedRoutes.some(route => window.location.pathname.includes(route));

    if (
        (!is_client_store_initialized && !isExcludedRoute) ||
        (has_wallet && !isHubRedirectionLoaded && !isExcludedRoute) ||
        (has_wallet && isHubRedirectionLoaded && !isExcludedRoute && isHubRedirectionEnabled)
    ) {
        return null;
    }

    return (
        <header
            className={classNames('header', {
                'header--is-disabled': is_app_disabled || is_route_modal_on,
                'header--is-hidden': platforms[platform],
            })}
        >
            <div className='header__menu-items'>
                <MenuLeft />
                <MenuRight />
            </div>
            <RealAccountSignup />
            <SetAccountCurrencyModal />
            <NewVersionNotification onUpdate={addUpdateNotification} />
        </header>
    );
});

export default withRouter(HeaderWallets);
