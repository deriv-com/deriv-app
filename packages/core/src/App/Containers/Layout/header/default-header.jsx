import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DesktopWrapper, MobileWrapper, Text, Icon } from '@deriv/components';
import { AccountActions, MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import { getDecimalPlaces, isMobile, platforms, routes } from '@deriv/shared';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';
import { BinaryLink } from 'App/Components/Routes';
import { Localize } from '@deriv/translations';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { connect } from 'Stores/connect';
import platform_config from 'App/Constants/platform-config';
import { withRouter } from 'react-router-dom';

const DefaultHeader = ({
    acc_switcher_disabled_message,
    account_type,
    addNotificationMessage,
    app_routing_history,
    balance,
    client_notifications,
    country_standpoint,
    currency,
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
    is_trading_assessment_for_existing_user_enabled,
    is_virtual,
    menu_items,
    notifications_count,
    openRealAccountSignup,
    platform,
    removeNotificationMessage,
    replaceCashierMenuOnclick,
    setIsPreAppStore,
    toggleAccountsDialog,
    toggleNotifications,
    is_landing_company_loaded,
}) => {
    const addUpdateNotification = () => addNotificationMessage(client_notifications.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

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
                    <MenuLinks is_logged_in={is_logged_in} items={menu_items} />
                </div>
                {is_logging_in
                    ? null
                    : is_logged_in && (
                          <DesktopWrapper>
                              <ExploreTradingHub />
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
    account_type: PropTypes.string,
    addNotificationMessage: PropTypes.func,
    app_routing_history: PropTypes.array,
    balance: PropTypes.string,
    client_notifications: PropTypes.object,
    currency: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    header_extension: PropTypes.any,
    is_acc_switcher_disabled: PropTypes.bool,
    is_acc_switcher_on: PropTypes.bool,
    is_app_disabled: PropTypes.bool,
    is_bot_allowed: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_dxtrade_allowed: PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_trading_assessment_for_existing_user_enabled: PropTypes.bool,
    notifications_count: PropTypes.number,
    openRealAccountSignup: PropTypes.func,
    platform: PropTypes.string,
    removeNotificationMessage: PropTypes.func,
    replaceCashierMenuOnclick: PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
    toggleNotifications: PropTypes.func,
    country_standpoint: PropTypes.object,
    history: PropTypes.object,
    menu_items: PropTypes.array,
    setIsPreAppStore: PropTypes.func,
    is_landing_company_loaded: PropTypes.bool,
};

export default connect(({ client, common, ui, menu, modules, notifications }) => ({
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
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    is_mt5_allowed: client.is_mt5_allowed,
    is_dxtrade_allowed: client.is_dxtrade_allowed,
    is_notifications_visible: notifications.is_notifications_visible,
    is_route_modal_on: ui.is_route_modal_on,
    is_virtual: client.is_virtual,
    menu_items: menu.extensions,
    notifications_count: notifications.notifications.length,
    openRealAccountSignup: ui.openRealAccountSignup,
    replaceCashierMenuOnclick: modules.cashier.general_store.replaceCashierMenuOnclick,
    platform: common.platform,
    removeNotificationMessage: notifications.removeNotificationMessage,
    toggleAccountsDialog: ui.toggleAccountsDialog,
    toggleNotifications: notifications.toggleNotificationsModal,
    is_trading_assessment_for_existing_user_enabled: ui.is_trading_assessment_for_existing_user_enabled,
    is_landing_company_loaded: client.is_landing_company_loaded,
    setIsPreAppStore: client.setIsPreAppStore,
}))(withRouter(DefaultHeader));
