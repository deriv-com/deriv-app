import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { getDecimalPlaces, platforms, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { MenuLinks } from 'App/Components/Layout/Header';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import ToggleMenuDrawerAccountsOS from 'App/Components/Layout/Header/toggle-menu-drawer-accounts-os.jsx';
import platform_config from 'App/Constants/platform-config';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import DerivShortLogo from './deriv-short-logo';
import HeaderAccountActions from './header-account-actions';
import TradersHubHomeButton from './traders-hub-home-button';

const HeaderLegacy = observer(() => {
    const { client, common, ui, notifications } = useStore();
    const {
        currency,
        has_any_real_account,
        is_bot_allowed,
        is_dxtrade_allowed,
        is_logged_in,
        is_logging_in,
        is_single_logging_in,
        is_mt5_allowed,
        is_virtual,
        is_switching,
    } = client;
    const { platform, is_from_tradershub_os } = common;
    const { header_extension, is_app_disabled, is_route_modal_on, toggleReadyToDepositModal, is_real_acc_signup_on } =
        ui;
    const { addNotificationMessage, client_notifications, removeNotificationMessage } = notifications;

    const { isDesktop } = useDevice();

    const history = useHistory();
    const { pathname } = useLocation();

    const traders_hub_routes =
        [routes.traders_hub].includes(pathname) ||
        [routes.account, routes.settings, routes.wallets_compare_accounts, routes.compare_cfds].some(route =>
            pathname.startsWith(route)
        );

    const addUpdateNotification = () => addNotificationMessage(client_notifications?.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

    React.useEffect(() => {
        document.addEventListener('IgnorePWAUpdate', removeUpdateNotification);
        return () => document.removeEventListener('IgnorePWAUpdate', removeUpdateNotification);
    }, [removeUpdateNotification]);

    const handleClickCashier = () => {
        if (!has_any_real_account && is_virtual) {
            toggleReadyToDepositModal();
        } else {
            history.push(routes.cashier_deposit);
        }
    };

    const filterPlatformsForClients = payload =>
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
        <header
            className={classNames('header', {
                'header--is-disabled': is_app_disabled || is_route_modal_on,
                'header--is-hidden': platforms[platform] && !is_from_tradershub_os,
                'header--tradershub_os_mobile': is_logged_in && is_from_tradershub_os && !isDesktop,
                'header--tradershub_os_desktop': is_logged_in && is_from_tradershub_os && isDesktop,
            })}
        >
            <div className='header__menu-items'>
                <div className='header__menu-left'>
                    {isDesktop ? (
                        <React.Fragment>
                            <DerivShortLogo />
                            <div className='header__divider' />
                            <TradersHubHomeButton />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {is_from_tradershub_os ? (
                                <ToggleMenuDrawerAccountsOS
                                    platform_config={filterPlatformsForClients(platform_config)}
                                />
                            ) : (
                                <>
                                    <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />
                                    {header_extension && is_logged_in && (
                                        <div className='header__menu-left-extensions'>{header_extension}</div>
                                    )}
                                </>
                            )}
                            <DerivShortLogo />
                        </React.Fragment>
                    )}
                    <MenuLinks is_traders_hub_routes={traders_hub_routes} />
                </div>

                <div
                    className={classNames('header__menu-right', {
                        'header__menu-right--hidden': !isDesktop && is_logging_in,
                    })}
                >
                    {(is_logging_in || is_single_logging_in || is_switching) && (
                        <div
                            id='dt_core_header_acc-info-preloader'
                            className={classNames('acc-info__preloader__dtrader', {
                                'acc-info__preloader__dtrader--no-currency': !currency,
                                'acc-info__preloader__dtrader--is-crypto': getDecimalPlaces(currency) > 2,
                            })}
                        >
                            <AccountsInfoLoader is_logged_in={is_logged_in} is_mobile={!isDesktop} speed={3} />
                        </div>
                    )}
                    {!is_from_tradershub_os && (
                        <HeaderAccountActions
                            onClickDeposit={handleClickCashier}
                            is_traders_hub_routes={traders_hub_routes}
                        />
                    )}
                </div>
            </div>
            {is_real_acc_signup_on && <RealAccountSignup />}
            <SetAccountCurrencyModal />
            <NewVersionNotification onUpdate={addUpdateNotification} />
        </header>
    );
});

export default HeaderLegacy;
