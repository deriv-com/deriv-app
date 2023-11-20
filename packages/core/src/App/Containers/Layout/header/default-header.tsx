import React from 'react';
import classNames from 'classnames';
import { getDecimalPlaces, platforms, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { AccountActions, MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import platform_config from 'App/Constants/platform-config';
import { useHistory } from 'react-router-dom';

const DefaultHeader = observer(() => {
    const { client, common, notifications, traders_hub, ui } = useStore();
    const {
        account_type,
        balance,
        currency,
        country_standpoint,
        is_bot_allowed,
        is_dxtrade_allowed,
        is_eu,
        is_logged_in,
        is_logging_in,
        is_mt5_allowed,
        is_switching,
        is_virtual,
        is_landing_company_loaded,
    } = client;
    const { app_routing_history, current_language, platform } = common;
    const {
        addNotificationMessage,
        client_notifications,
        is_notifications_visible,
        notifications: notifications_array,
        removeNotificationMessage,
        toggleNotificationsModal,
    } = notifications;
    const { setTogglePlatformType } = traders_hub;
    const {
        account_switcher_disabled_message,
        disableApp,
        enableApp,
        header_extension,
        is_account_switcher_disabled,
        is_accounts_switcher_on,
        is_desktop,
        is_mobile,
        is_app_disabled,
        is_route_modal_on,
        openRealAccountSignup,
        toggleAccountsDialog,
        is_trading_assessment_for_existing_user_enabled,
    } = ui;

    const history = useHistory();

    const addUpdateNotification = () => addNotificationMessage(client_notifications?.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

    React.useEffect(() => {
        document.addEventListener('IgnorePWAUpdate', removeUpdateNotification);
        return () => document.removeEventListener('IgnorePWAUpdate', removeUpdateNotification);
    }, [removeUpdateNotification]);

    const onClickDeposit = () => history.push(routes.cashier_deposit);

    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            if (config.link_to === routes.dxtrade) {
                return is_dxtrade_allowed;
            }
            if (
                config.link_to === routes.bot ||
                config.href === routes.binarybot ||
                config.href === routes.smarttrader
            ) {
                return is_bot_allowed;
            }
            return true;
        });

    return (
        <header
            className={classNames('header', {
                'header--is-disabled': is_app_disabled || is_route_modal_on,
                'header--is-hidden': platforms[platform],
            })}
        >
            <div className='header__menu-items'>
                <div className='header__menu-left'>
                    {is_desktop && (
                        <PlatformSwitcher
                            app_routing_history={app_routing_history}
                            is_landing_company_loaded={is_landing_company_loaded}
                            is_logged_in={is_logged_in}
                            is_logging_in={is_logging_in}
                            platform_config={filterPlatformsForClients(platform_config)}
                            setTogglePlatformType={setTogglePlatformType}
                            current_language={current_language}
                        />
                    )}
                    {is_mobile && (
                        <React.Fragment>
                            <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />
                            {header_extension && is_logged_in && (
                                <div className='header__menu-left-extensions'>{header_extension}</div>
                            )}
                        </React.Fragment>
                    )}
                    <MenuLinks />
                </div>
                <div
                    className={classNames('header__menu-right', {
                        'header__menu-right--hidden': is_mobile && is_logging_in,
                    })}
                >
                    {(is_logging_in || is_switching) && (
                        <div
                            id='dt_core_header_acc-info-preloader'
                            className={classNames('acc-info__preloader', {
                                'acc-info__preloader--no-currency': !currency,
                                'acc-info__preloader--is-crypto': getDecimalPlaces(currency) > 2,
                            })}
                        >
                            <AccountsInfoLoader is_logged_in={is_logged_in} is_mobile={is_mobile} speed={3} />
                        </div>
                    )}
                    <div id={'dt_core_header_acc-info-container'} className='acc-info__container'>
                        <AccountActions
                            acc_switcher_disabled_message={account_switcher_disabled_message}
                            account_type={account_type}
                            balance={balance}
                            currency={currency}
                            country_standpoint={country_standpoint}
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_acc_switcher_on={is_accounts_switcher_on}
                            is_acc_switcher_disabled={is_account_switcher_disabled}
                            is_eu={is_eu}
                            is_notifications_visible={is_notifications_visible}
                            is_logged_in={is_logged_in}
                            is_virtual={is_virtual}
                            onClickDeposit={onClickDeposit}
                            notifications_count={notifications_array.length}
                            toggleAccountsDialog={toggleAccountsDialog}
                            toggleNotifications={toggleNotificationsModal}
                            openRealAccountSignup={openRealAccountSignup}
                        />
                    </div>
                </div>
            </div>
            {/*
                Prevent the modals that are part of Real Account signup to get triggered when the corresponding store value changes by
                removing the parent element from DOM
                */}
            {!is_trading_assessment_for_existing_user_enabled && <RealAccountSignup />}
            <SetAccountCurrencyModal />
            <NewVersionNotification onUpdate={addUpdateNotification} />
        </header>
    );
});

export default DefaultHeader;
