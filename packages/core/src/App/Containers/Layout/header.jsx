import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared/utils/screen';
import { getDecimalPlaces } from '@deriv/shared/utils/currency';
import { AccountActions, MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import { connect } from 'Stores/connect';
import { header_links } from 'App/Constants/header-links';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';
import routes from 'Constants/routes';

class Header extends React.Component {
    toggle_menu_drawer_ref = React.createRef();

    onClickDeposit = () => {
        this.props.history.push(routes.cashier_deposit);
    };

    render() {
        const {
            account_status,
            acc_switcher_disabled_message,
            balance,
            can_upgrade,
            can_upgrade_to,
            currency,
            enableApp,
            header_extension,
            is_acc_switcher_on,
            is_acc_switcher_disabled,
            is_app_disabled,
            is_dark_mode,
            is_high_risk,
            is_logged_in,
            is_logging_in,
            is_mt5_allowed,
            is_notifications_visible,
            is_route_modal_on,
            is_virtual,
            disableApp,
            logoutClient,
            notifications_count,
            setDarkMode,
            toggleAccountsDialog,
            toggleNotifications,
            openRealAccountSignup,
        } = this.props;

        const filterPlatformsForClients = payload =>
            payload.filter(config => {
                // non-CR clients cannot open MT5 account
                const is_mt5_eligible = !(is_logged_in && config.link_to === routes.mt5 && !is_mt5_allowed);
                return is_mt5_eligible;
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
                            <PlatformSwitcher platform_config={filterPlatformsForClients(platform_config)} />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <ToggleMenuDrawer
                                ref={this.toggle_menu_drawer_ref}
                                account_status={account_status}
                                enableApp={enableApp}
                                disableApp={disableApp}
                                logoutClient={logoutClient}
                                is_dark_mode={is_dark_mode}
                                is_high_risk={is_high_risk}
                                is_logged_in={is_logged_in}
                                toggleTheme={setDarkMode}
                                platform_switcher={
                                    <PlatformSwitcher
                                        is_mobile
                                        platform_config={filterPlatformsForClients(platform_config)}
                                        toggleDrawer={this.toggle_menu_drawer_ref.current?.toggleDrawer}
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
                                can_upgrade_to={can_upgrade_to}
                                currency={currency}
                                can_upgrade={can_upgrade}
                                disableApp={disableApp}
                                enableApp={enableApp}
                                is_acc_switcher_on={is_acc_switcher_on}
                                is_acc_switcher_disabled={is_acc_switcher_disabled}
                                is_notifications_visible={is_notifications_visible}
                                is_logged_in={is_logged_in}
                                is_virtual={is_virtual}
                                onClickDeposit={this.onClickDeposit}
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
            </header>
        );
    }
}

Header.propTypes = {
    account_status: PropTypes.object,
    acc_switcher_disabled_message: PropTypes.string,
    balance: PropTypes.string,
    can_upgrade: PropTypes.bool,
    can_upgrade_to: PropTypes.string,
    currency: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_acc_switcher_disabled: PropTypes.bool,
    is_acc_switcher_on: PropTypes.bool,
    is_app_disabled: PropTypes.bool,
    is_dark_mode: PropTypes.bool,
    is_high_risk: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
    is_virtual: PropTypes.bool,
    logoutClient: PropTypes.func,
    notifications_count: PropTypes.any,
    setDarkMode: PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
    toggleNotifications: PropTypes.func,
};

export default connect(({ client, ui }) => ({
    acc_switcher_disabled_message: ui.account_switcher_disabled_message,
    account_status: client.account_status,
    balance: client.balance,
    can_upgrade: client.can_upgrade,
    can_upgrade_to: client.can_upgrade_to,
    currency: client.currency,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    logoutClient: client.logout,
    is_virtual: client.is_virtual,
    enableApp: ui.enableApp,
    header_extension: ui.header_extension,
    is_acc_switcher_disabled: ui.is_account_switcher_disabled,
    is_acc_switcher_on: ui.is_accounts_switcher_on,
    is_dark_mode: ui.is_dark_mode_on,
    is_app_disabled: ui.is_app_disabled,
    is_high_risk: client.is_high_risk,
    is_loading: ui.is_loading,
    is_mt5_allowed: client.is_mt5_allowed,
    notifications_count: ui.notifications.length,
    is_notifications_visible: ui.is_notifications_visible,
    is_route_modal_on: ui.is_route_modal_on,
    openRealAccountSignup: ui.openRealAccountSignup,
    disableApp: ui.disableApp,
    toggleAccountsDialog: ui.toggleAccountsDialog,
    setDarkMode: ui.setDarkMode,
    toggleNotifications: ui.toggleNotificationsModal,
}))(withRouter(Header));
