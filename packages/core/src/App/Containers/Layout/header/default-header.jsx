import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { AccountActions, MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import { getDecimalPlaces, isMobile, platforms, routes } from '@deriv/shared';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import platform_config from 'App/Constants/platform-config';
import { withRouter } from 'react-router-dom';
import { observer, useStore } from '@deriv/stores';

const DefaultHeader = observer(({ history }) => {
    const { client, common, ui, notifications } = useStore();
    const {
        is_landing_company_loaded,
        is_switching,
        is_virtual,
        is_bot_allowed,
        is_eu,
        is_logged_in,
        is_logging_in,
        is_mt5_allowed,
        is_dxtrade_allowed,
        currency,
        country_standpoint,
        account_type,
        balance,
    } = client;

    const {
        disableApp,
        enableApp,
        header_extension,
        is_account_switcher_disabled: is_acc_switcher_disabled,
        is_accounts_switcher_on: is_acc_switcher_on,
        is_app_disabled,
        account_switcher_disabled_message: acc_switcher_disabled_message,
        is_route_modal_on,
        openRealAccountSignup,
        toggleAccountsDialog,
        is_trading_assessment_for_existing_user_enabled,
    } = ui;

    const {
        addNotificationMessage,
        client_notifications,
        is_notifications_visible,
        removeNotificationMessage,
        toggleNotificationsModal: toggleNotifications,
    } = notifications;

    const notifications_count = notifications.notifications.length;
    const { app_routing_history, platform } = common;
    const addUpdateNotification = () => addNotificationMessage(client_notifications.new_version_available);
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
                    <DesktopWrapper>
                        <PlatformSwitcher
                            app_routing_history={app_routing_history}
                            is_landing_company_loaded={is_landing_company_loaded}
                            is_logged_in={is_logged_in}
                            is_logging_in={is_logging_in}
                            platform_config={filterPlatformsForClients(platform_config)}
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />
                        {header_extension && is_logged_in && (
                            <div className='header__menu-left-extensions'>{header_extension}</div>
                        )}
                    </MobileWrapper>
                    <MenuLinks />
                </div>
                <div
                    className={classNames('header__menu-right', {
                        'header__menu-right--hidden': isMobile() && is_logging_in,
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
                            <AccountsInfoLoader is_logged_in={is_logged_in} is_mobile={isMobile()} speed={3} />
                        </div>
                    )}

                    <div id={'dt_core_header_acc-info-container'} className='acc-info__container'>
                        <AccountActions
                            acc_switcher_disabled_message={acc_switcher_disabled_message}
                            account_type={account_type}
                            balance={balance}
                            currency={currency}
                            country_standpoint={country_standpoint}
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_acc_switcher_on={is_acc_switcher_on}
                            is_acc_switcher_disabled={is_acc_switcher_disabled}
                            is_eu={is_eu}
                            is_notifications_visible={is_notifications_visible}
                            is_logged_in={is_logged_in}
                            is_virtual={is_virtual}
                            onClickDeposit={onClickDeposit}
                            notifications_count={notifications_count}
                            toggleAccountsDialog={toggleAccountsDialog}
                            toggleNotifications={toggleNotifications}
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

DefaultHeader.propTypes = {
    history: PropTypes.object,
};

export default withRouter(DefaultHeader);
