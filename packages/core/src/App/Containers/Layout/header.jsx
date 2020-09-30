import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { routes, isMobile, getDecimalPlaces, getPlatformHeader } from '@deriv/shared';
import { AccountActions, MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import { connect } from 'Stores/connect';
import { clientNotifications } from 'Stores/Helpers/client-notifications';
import { header_links } from 'App/Constants/header-links';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';

const Header = ({
    acc_switcher_disabled_message,
    account_status,
    addNotificationMessage,
    app_routing_history,
    balance,
    currency,
    disableApp,
    enableApp,
    header_extension,
    history,
    is_acc_switcher_disabled,
    is_acc_switcher_on,
    is_app_disabled,
    is_dark_mode,
    is_logged_in,
    is_logging_in,
    is_mt5_allowed,
    is_notifications_visible,
    is_p2p_enabled,
    is_payment_agent_transfer_visible,
    is_payment_agent_visible,
    is_route_modal_on,
    is_virtual,
    location,
    logoutClient,
    needs_financial_assessment,
    notifications_count,
    openRealAccountSignup,
    removeNotificationMessage,
    setDarkMode,
    toggleAccountsDialog,
    toggleNotifications,
}) => {
    const toggle_menu_drawer_ref = React.useRef(null);

    React.useEffect(() => {
        document.addEventListener('IgnorePWAUpdate', removeUpdateNotification);
        return () => document.removeEventListener('IgnorePWAUpdate', removeUpdateNotification);
    }, []);

    const addUpdateNotification = () => addNotificationMessage(clientNotifications().new_version_available);
    const removeUpdateNotification = () => removeNotificationMessage({ key: 'new_version_available' });
    const onClickDeposit = () => history.push(routes.cashier_deposit);
    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            // non-CR clients cannot open MT5 account
            return !(is_logged_in && config.link_to === routes.mt5 && !is_mt5_allowed);
        });

    return (
        <header
            className={classNames('header', {
                'header--is-disabled': is_app_disabled || is_route_modal_on,
            })}
        >
            <div className='header__menu-items'>
                <div className='header__menu-left'>
                    <DesktopWrapper>
                        <PlatformSwitcher
                            app_routing_history={app_routing_history}
                            platform_config={filterPlatformsForClients(platform_config)}
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <ToggleMenuDrawer
                            ref={toggle_menu_drawer_ref}
                            account_status={account_status}
                            enableApp={enableApp}
                            disableApp={disableApp}
                            location={location}
                            logoutClient={logoutClient}
                            is_dark_mode={is_dark_mode}
                            is_logged_in={is_logged_in}
                            is_p2p_enabled={is_p2p_enabled}
                            is_payment_agent_transfer_visible={is_payment_agent_transfer_visible}
                            is_payment_agent_visible={is_payment_agent_visible}
                            is_virtual={is_virtual}
                            needs_financial_assessment={needs_financial_assessment}
                            toggleTheme={setDarkMode}
                            platform_header={getPlatformHeader(app_routing_history)}
                            platform_switcher={
                                <PlatformSwitcher
                                    app_routing_history={app_routing_history}
                                    is_mobile
                                    platform_config={filterPlatformsForClients(platform_config)}
                                    toggleDrawer={toggle_menu_drawer_ref.current?.toggleDrawer}
                                />
                            }
                        />
                        {header_extension && is_logged_in && (
                            <div className='header__menu-left-extensions'>{header_extension}</div>
                        )}
                    </MobileWrapper>
                    <MenuLinks is_logged_in={is_logged_in} items={header_links} />
                </div>
                <div
                    className={classNames('header__menu-right', {
                        'header__menu-right--mobile': isMobile(),
                    })}
                >
                    {is_logging_in && (
                        <div
                            className={classNames('acc-info__preloader', {
                                'acc-info__preloader--no-currency': !currency,
                                'acc-info__preloader--is-crypto': getDecimalPlaces(currency) > 2,
                            })}
                        >
                            <AccountsInfoLoader is_logged_in={is_logged_in} is_mobile={isMobile()} speed={3} />
                        </div>
                    )}
                    <div className='acc-info__container'>
                        <AccountActions
                            acc_switcher_disabled_message={acc_switcher_disabled_message}
                            balance={balance}
                            currency={currency}
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_acc_switcher_on={is_acc_switcher_on}
                            is_acc_switcher_disabled={is_acc_switcher_disabled}
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
            <RealAccountSignup />
            <SetAccountCurrencyModal />
            <NewVersionNotification onUpdate={addUpdateNotification} />
        </header>
    );
};

Header.propTypes = {
    acc_switcher_disabled_message: PropTypes.string,
    account_status: PropTypes.object,
    addNotificationMessage: PropTypes.func,
    app_routing_history: PropTypes.array,
    balance: PropTypes.string,
    currency: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    header_extension: PropTypes.any,
    is_acc_switcher_disabled: PropTypes.bool,
    is_acc_switcher_on: PropTypes.bool,
    is_app_disabled: PropTypes.bool,
    is_dark_mode: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    is_p2p_enabled: PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
    is_virtual: PropTypes.bool,
    logoutClient: PropTypes.func,
    needs_financial_assessment: PropTypes.bool,
    notifications_count: PropTypes.number,
    openRealAccountSignup: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    setDarkMode: PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
    toggleNotifications: PropTypes.func,
};

export default connect(({ client, common, ui, modules }) => ({
    acc_switcher_disabled_message: ui.account_switcher_disabled_message,
    account_status: client.account_status,
    addNotificationMessage: ui.addNotificationMessage,
    app_routing_history: common.app_routing_history,
    balance: client.balance,
    currency: client.currency,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    header_extension: ui.header_extension,
    is_acc_switcher_disabled: ui.is_account_switcher_disabled,
    is_acc_switcher_on: !!ui.is_accounts_switcher_on,
    is_app_disabled: ui.is_app_disabled,
    is_dark_mode: ui.is_dark_mode_on,
    is_loading: ui.is_loading,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    is_mt5_allowed: client.is_mt5_allowed,
    is_notifications_visible: ui.is_notifications_visible,
    is_p2p_enabled: modules.cashier.is_p2p_enabled,
    is_payment_agent_transfer_visible: modules.cashier.is_payment_agent_transfer_visible,
    is_payment_agent_visible: modules.cashier.is_payment_agent_visible,
    is_route_modal_on: ui.is_route_modal_on,
    is_virtual: client.is_virtual,
    logoutClient: client.logout,
    needs_financial_assessment: client.needs_financial_assessment,
    notifications_count: ui.notifications.length,
    openRealAccountSignup: ui.openRealAccountSignup,
    removeNotificationMessage: ui.removeNotificationMessage,
    setDarkMode: ui.setDarkMode,
    toggleAccountsDialog: ui.toggleAccountsDialog,
    toggleNotifications: ui.toggleNotificationsModal,
}))(withRouter(Header));
