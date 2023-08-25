import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { routes, isMobile, getDecimalPlaces, platforms } from '@deriv/shared';
import { AccountActions, MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import { connect } from 'Stores/connect';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';

import { TradersHubHomeButton } from './trading-hub-header';

const Divider = () => <div className='header__menu--dtrader--separator' />;

const DTraderHeader = ({
    acc_switcher_disabled_message,
    account_type,
    addNotificationMessage,
    app_routing_history,
    balance,
    client_notifications,
    currency,
    country_standpoint,
    current_language,
    disableApp,
    enableApp,
    header_extension,
    history,
    is_acc_switcher_disabled,
    is_acc_switcher_on,
    is_app_disabled,
    is_bot_allowed,
    is_dxtrade_allowed,
    is_eu,
    is_logged_in,
    is_logging_in,
    is_mt5_allowed,
    is_notifications_visible,
    is_route_modal_on,
    is_virtual,
    notifications_count,
    openRealAccountSignup,
    platform,
    removeNotificationMessage,
    toggleAccountsDialog,
    toggleNotifications,
    is_switching,
    toggleReadyToDepositModal,
    has_any_real_account,
    setTogglePlatformType,
}) => {
    const addUpdateNotification = () => addNotificationMessage(client_notifications.new_version_available);
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
                            platform_config={filterPlatformsForClients(platform_config)}
                            setTogglePlatformType={setTogglePlatformType}
                            current_language={current_language}
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />

                        {header_extension && is_logged_in && (
                            <div className='header__menu-left-extensions'>{header_extension}</div>
                        )}
                    </MobileWrapper>
                    <DesktopWrapper>
                        <TradersHubHomeButton />
                    </DesktopWrapper>
                    <MenuLinks />
                </div>

                <div
                    className={classNames('header__menu-right', {
                        'header__menu-right--hidden': isMobile() && is_logging_in,
                    })}
                >
                    <DesktopWrapper>
                        <div className='header__menu--dtrader--separator--account'>
                            <Divider />
                        </div>
                    </DesktopWrapper>
                    {(is_logging_in || is_switching) && (
                        <div
                            id='dt_core_header_acc-info-preloader'
                            className={classNames('acc-info__preloader__dtrader', {
                                'acc-info__preloader__dtrader--no-currency': !currency,
                                'acc-info__preloader__dtrader--is-crypto': getDecimalPlaces(currency) > 2,
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
                            onClickDeposit={handleClickCashier}
                            notifications_count={notifications_count}
                            toggleAccountsDialog={toggleAccountsDialog}
                            toggleNotifications={toggleNotifications}
                            openRealAccountSignup={openRealAccountSignup}
                        />
                    </div>
                </div>
            </div>
            <RealAccountSignup />
            <SetAccountCurrencyModal />
            <NewVersionNotification onUpdate={addUpdateNotification} />
        </header>
    );
};

DTraderHeader.propTypes = {
    acc_switcher_disabled_message: PropTypes.string,
    account_type: PropTypes.string,
    addNotificationMessage: PropTypes.func,
    app_routing_history: PropTypes.array,
    balance: PropTypes.string,
    client_notifications: PropTypes.object,
    current_language: PropTypes.string,
    currency: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    header_extension: PropTypes.any,
    is_acc_switcher_disabled: PropTypes.bool,
    is_acc_switcher_on: PropTypes.bool,
    is_app_disabled: PropTypes.bool,
    is_bot_allowed: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_dxtrade_allowed: PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
    is_virtual: PropTypes.bool,
    notifications_count: PropTypes.number,
    openRealAccountSignup: PropTypes.func,
    platform: PropTypes.string,
    removeNotificationMessage: PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
    toggleNotifications: PropTypes.func,
    country_standpoint: PropTypes.object,
    history: PropTypes.object,
    is_switching: PropTypes.bool,
    toggleReadyToDepositModal: PropTypes.func,
    has_any_real_account: PropTypes.bool,
    setTogglePlatformType: PropTypes.func,
};

export default connect(({ client, common, ui, notifications, traders_hub }) => ({
    acc_switcher_disabled_message: ui.account_switcher_disabled_message,
    account_type: client.account_type,
    addNotificationMessage: notifications.addNotificationMessage,
    app_routing_history: common.app_routing_history,
    balance: client.balance,
    client_notifications: notifications.client_notifications,
    currency: client.currency,
    country_standpoint: client.country_standpoint,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    header_extension: ui.header_extension,
    is_acc_switcher_disabled: ui.is_account_switcher_disabled,
    is_acc_switcher_on: !!ui.is_accounts_switcher_on,
    is_app_disabled: ui.is_app_disabled,
    is_bot_allowed: client.is_bot_allowed,
    is_eu: client.is_eu,
    is_loading: ui.is_loading,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    is_mt5_allowed: client.is_mt5_allowed,
    is_dxtrade_allowed: client.is_dxtrade_allowed,
    is_notifications_visible: notifications.is_notifications_visible,
    is_route_modal_on: ui.is_route_modal_on,
    is_virtual: client.is_virtual,
    notifications_count: notifications.notifications.length,
    openRealAccountSignup: ui.openRealAccountSignup,
    platform: common.platform,
    removeNotificationMessage: notifications.removeNotificationMessage,
    toggleAccountsDialog: ui.toggleAccountsDialog,
    toggleNotifications: notifications.toggleNotificationsModal,
    is_switching: client.is_switching,
    toggleReadyToDepositModal: ui.toggleReadyToDepositModal,
    has_any_real_account: client.has_any_real_account,
    setTogglePlatformType: traders_hub.setTogglePlatformType,
    current_language: common.current_language,
}))(withRouter(DTraderHeader));
