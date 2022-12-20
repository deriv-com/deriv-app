import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileWrapper, Text, Icon } from '@deriv/components';
import { routes, isMobile, getDecimalPlaces, getPlatformInformation, platforms } from '@deriv/shared';
import { AccountActions, MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import { connect } from 'Stores/connect';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';
import { BinaryLink } from 'App/Components/Routes';
import { Localize } from '@deriv/translations';

const DefaultHeader = ({
    acc_switcher_disabled_message,
    account_status,
    account_type,
    active_account_landing_company,
    addNotificationMessage,
    app_routing_history,
    balance,
    changeCurrentLanguage,
    client_notifications,
    country_standpoint,
    currency,
    disableApp,
    enableApp,
    header_extension,
    history,
    is_acc_switcher_disabled,
    is_acc_switcher_on,
    is_account_transfer_visible,
    is_app_disabled,
    is_bot_allowed,
    is_dark_mode,
    is_dxtrade_allowed,
    is_eu,
    is_logged_in,
    is_logging_in,
    is_mt5_allowed,
    is_notifications_visible,
    is_onramp_tab_visible,
    is_p2p_enabled,
    is_payment_agent_transfer_visible,
    is_payment_agent_visible,
    is_pre_appstore,
    is_risky_client,
    is_route_modal_on,
    is_trading_assessment_for_existing_user_enabled,
    is_virtual,
    location,
    logoutClient,
    menu_items,
    notifications_count,
    openRealAccountSignup,
    platform,
    removeNotificationMessage,
    replaceCashierMenuOnclick,
    setDarkMode,
    setIsPreAppStore,
    should_allow_authentication,
    toggleAccountsDialog,
    toggleNotifications,
}) => {
    const toggle_menu_drawer_ref = React.useRef(null);
    const addUpdateNotification = () => addNotificationMessage(client_notifications.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

    const RedirectToOldInterface = () => {
        const disablePreAppstore = () => setIsPreAppStore(false);

        return (
            <div className='trading-hub-header__redirect'>
                <BinaryLink
                    to={routes.trade}
                    className='trading-hub-header__redirect--link'
                    onClick={disablePreAppstore}
                >
                    <Text as='p' size='xs' color='general'>
                        <Localize i18n_default_text="Exit Trader's hub" />
                    </Text>
                    <Icon className='trading-hub-header__redirect--beta' icon='IcAppstoreTradingHubBeta' size={50} />
                    <Icon icon='IcArrowRight' size={18} color='red' />
                </BinaryLink>
            </div>
        );
    };

    React.useEffect(() => {
        if (is_logged_in) replaceCashierMenuOnclick();
    }, [is_logged_in]);

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

    const Divider = () => {
        return <div className='header__menu--separator' />;
    };

    const ExploreTradingHub = () => {
        const enablePreAppstore = () => setIsPreAppStore(true);

        return (
            <div className='header__menu__redirect'>
                <BinaryLink
                    to={routes.traders_hub}
                    className='header__menu__redirect--link'
                    onClick={enablePreAppstore}
                >
                    <Text as='p' size='xs'>
                        <Localize i18n_default_text="Explore Trader's hub" />
                    </Text>
                    <Icon
                        className='trading-hub-header__dtrader--redirect--beta'
                        icon='IcAppstoreTradingHubBeta'
                        size={45}
                    />
                    <Icon icon='IcArrowRight' size={18} color='red' />
                </BinaryLink>
            </div>
        );
    };

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
                            is_pre_appstore={is_pre_appstore}
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <ToggleMenuDrawer
                            changeCurrentLanguage={changeCurrentLanguage}
                            ref={toggle_menu_drawer_ref}
                            should_allow_authentication={should_allow_authentication}
                            account_status={account_status}
                            enableApp={enableApp}
                            disableApp={disableApp}
                            location={location}
                            logoutClient={logoutClient}
                            is_dark_mode={is_dark_mode}
                            is_logged_in={is_logged_in}
                            is_p2p_enabled={is_p2p_enabled}
                            is_payment_agent_transfer_visible={is_payment_agent_transfer_visible}
                            is_onramp_tab_visible={is_onramp_tab_visible}
                            is_payment_agent_visible={is_payment_agent_visible}
                            is_pre_appstore={is_pre_appstore}
                            is_account_transfer_visible={is_account_transfer_visible}
                            is_virtual={is_virtual}
                            is_risky_client={is_risky_client}
                            toggleTheme={setDarkMode}
                            platform_header={getPlatformInformation(app_routing_history).header}
                            active_account_landing_company={active_account_landing_company}
                            setIsPreAppStore={setIsPreAppStore}
                            platform_switcher={
                                <PlatformSwitcher
                                    app_routing_history={app_routing_history}
                                    is_mobile
                                    platform_config={filterPlatformsForClients(platform_config)}
                                    toggleDrawer={toggle_menu_drawer_ref.current?.toggleDrawer}
                                    is_pre_appstore={is_pre_appstore}
                                />
                            }
                        />
                        {header_extension && is_logged_in && (
                            <div className='header__menu-left-extensions'>{header_extension}</div>
                        )}
                    </MobileWrapper>
                    <MenuLinks is_logged_in={is_logged_in} items={menu_items} />
                </div>
                {is_logged_in && (
                    <DesktopWrapper>
                        {window.location.pathname.startsWith(routes.appstore) ? (
                            <RedirectToOldInterface />
                        ) : (
                            <ExploreTradingHub />
                        )}
                        <Divider />
                    </DesktopWrapper>
                )}
                <div
                    className={classNames('header__menu-right', {
                        'header__menu-right--hidden': isMobile() && is_logging_in,
                    })}
                >
                    {is_logging_in && (
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
};

DefaultHeader.propTypes = {
    acc_switcher_disabled_message: PropTypes.string,
    account_status: PropTypes.object,
    account_type: PropTypes.string,
    active_account_landing_company: PropTypes.string,
    addNotificationMessage: PropTypes.func,
    app_routing_history: PropTypes.array,
    balance: PropTypes.string,
    changeCurrentLanguage: PropTypes.func,
    client_notifications: PropTypes.object,
    country_standpoint: PropTypes.object,
    currency: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    header_extension: PropTypes.any,
    history: PropTypes.object,
    is_acc_switcher_disabled: PropTypes.bool,
    is_acc_switcher_on: PropTypes.bool,
    is_account_transfer_visible: PropTypes.bool,
    is_app_disabled: PropTypes.bool,
    is_bot_allowed: PropTypes.bool,
    is_dark_mode: PropTypes.bool,
    is_dxtrade_allowed: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    is_onramp_tab_visible: PropTypes.bool,
    is_p2p_enabled: PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_pre_appstore: PropTypes.bool,
    is_risky_client: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
    is_trading_assessment_for_existing_user_enabled: PropTypes.bool,
    is_virtual: PropTypes.bool,
    location: PropTypes.object,
    logoutClient: PropTypes.func,
    menu_items: PropTypes.array,
    notifications_count: PropTypes.number,
    openRealAccountSignup: PropTypes.func,
    platform: PropTypes.string,
    removeNotificationMessage: PropTypes.func,
    replaceCashierMenuOnclick: PropTypes.func,
    setDarkMode: PropTypes.func,
    setIsPreAppStore: PropTypes.func,
    should_allow_authentication: PropTypes.bool,
    toggleAccountsDialog: PropTypes.func,
    toggleNotifications: PropTypes.func,
};

export default connect(({ client, common, ui, menu, modules, notifications }) => ({
    acc_switcher_disabled_message: ui.account_switcher_disabled_message,
    account_status: client.account_status,
    account_type: client.account_type,
    active_account_landing_company: client.landing_company_shortcode,
    addNotificationMessage: notifications.addNotificationMessage,
    app_routing_history: common.app_routing_history,
    balance: client.balance,
    changeCurrentLanguage: common.changeCurrentLanguage,
    client_notifications: notifications.client_notifications,
    country_standpoint: client.country_standpoint,
    currency: client.currency,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    header_extension: ui.header_extension,
    is_acc_switcher_disabled: ui.is_account_switcher_disabled,
    is_acc_switcher_on: !!ui.is_accounts_switcher_on,
    is_account_transfer_visible: modules.cashier.account_transfer.is_account_transfer_visible,
    is_app_disabled: ui.is_app_disabled,
    is_bot_allowed: client.is_bot_allowed,
    is_dark_mode: ui.is_dark_mode_on,
    is_dxtrade_allowed: client.is_dxtrade_allowed,
    is_eu: client.is_eu,
    is_loading: ui.is_loading,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    is_mt5_allowed: client.is_mt5_allowed,
    is_notifications_visible: notifications.is_notifications_visible,
    is_onramp_tab_visible: modules.cashier.onramp.is_onramp_tab_visible,
    is_p2p_enabled: modules.cashier.general_store.is_p2p_enabled,
    is_payment_agent_transfer_visible: modules.cashier.payment_agent_transfer.is_payment_agent_transfer_visible,
    is_payment_agent_visible: modules.cashier.payment_agent.is_payment_agent_visible,
    is_pre_appstore: client.is_pre_appstore,
    is_risky_client: client.is_risky_client,
    is_route_modal_on: ui.is_route_modal_on,
    is_trading_assessment_for_existing_user_enabled: ui.is_trading_assessment_for_existing_user_enabled,
    is_virtual: client.is_virtual,
    logoutClient: client.logout,
    menu_items: menu.extensions,
    notifications_count: notifications.filtered_notifications.length,
    openRealAccountSignup: ui.openRealAccountSignup,
    platform: common.platform,
    removeNotificationMessage: notifications.removeNotificationMessage,
    replaceCashierMenuOnclick: modules.cashier.general_store.replaceCashierMenuOnclick,
    setDarkMode: ui.setDarkMode,
    setIsPreAppStore: client.setIsPreAppStore,
    should_allow_authentication: client.should_allow_authentication,
    toggleAccountsDialog: ui.toggleAccountsDialog,
    toggleNotifications: notifications.toggleNotificationsModal,
}))(withRouter(DefaultHeader));
