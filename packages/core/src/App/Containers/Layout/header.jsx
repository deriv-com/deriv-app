import classNames             from 'classnames';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { withRouter }         from 'react-router-dom';
import {
    AccountActions,
    MenuLinks,
    PlatformSwitcher }        from 'App/Components/Layout/Header';
import platform_config        from 'App/Constants/platform-config';
import Lazy                   from 'App/Containers/Lazy';
import RealAccountSignup      from 'App/Containers/RealAccountSignup';
import { connect }            from 'Stores/connect';
import { header_links }       from 'App/Constants/header-links';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';
import routes                 from 'Constants/routes';

class Header extends React.Component {
    onClickDeposit = () => {
        this.props.history.push(routes.cashier_deposit);
    };

    render() {
        const {
            balance,
            can_upgrade,
            can_upgrade_to,
            currency,
            enableApp,
            is_acc_switcher_on,
            is_app_disabled,
            is_logged_in,
            is_logging_in,
            is_mobile,
            is_mt5_allowed,
            is_notifications_visible,
            is_route_modal_on,
            is_virtual,
            disableApp,
            landing_company_shortcode,
            notifications_count,
            toggleAccountsDialog,
            toggleNotifications,
            openRealAccountSignup,
        } = this.props;

        const filterPlatformsForClients = (payload) => payload.filter(config => {
            // non-CR clients cannot open MT5 account
            const is_mt5_eligible = !(
                is_logged_in &&
                config.link_to === routes.mt5 &&
                !is_mt5_allowed
            );
            return is_mt5_eligible;
        });

        return (
            <header className={classNames('header', {
                'header--is-disabled': (is_app_disabled || is_route_modal_on),
            })}
            >
                <div className='header__menu-items'>
                    <div className='header__menu-left'>
                        <PlatformSwitcher platform_config={filterPlatformsForClients(platform_config)} />
                        <Lazy
                            has_progress={false}
                            ctor={() => import(/* webpackChunkName: "toggle-menu-drawer", webpackPreload: true */'App/Components/Layout/Header/toggle-menu-drawer.jsx')}
                            should_load={is_mobile}
                        />
                        <MenuLinks
                            is_logged_in={is_logged_in}
                            items={header_links}
                        />
                    </div>
                    <div className='header__menu-right'>
                        {is_logging_in &&
                        <div className='acc-info__preloader'>
                            <AccountsInfoLoader is_logged_in={is_logged_in} speed={3} />
                        </div>
                        }
                        <div className='acc-info__container'>
                            <AccountActions
                                balance={balance}
                                can_upgrade_to={can_upgrade_to}
                                currency={currency}
                                can_upgrade={can_upgrade}
                                disableApp={disableApp}
                                enableApp={enableApp}
                                is_acc_switcher_on={is_acc_switcher_on}
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
            </header>
        );
    }
}

Header.propTypes = {
    balance                 : PropTypes.string,
    can_upgrade             : PropTypes.bool,
    can_upgrade_to          : PropTypes.string,
    currency                : PropTypes.string,
    disableApp              : PropTypes.func,
    enableApp               : PropTypes.func,
    is_acc_switcher_on      : PropTypes.bool,
    is_app_disabled         : PropTypes.bool,
    is_dark_mode            : PropTypes.bool,
    is_logged_in            : PropTypes.bool,
    is_logging_in           : PropTypes.bool,
    is_mobile               : PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    is_route_modal_on       : PropTypes.bool,
    is_virtual              : PropTypes.bool,
    notifications_count     : PropTypes.any,
    toggleAccountsDialog    : PropTypes.func,
    toggleNotifications     : PropTypes.func,
};

export default connect(
    ({ client, ui }) => ({
        balance                  : client.balance,
        can_upgrade              : client.can_upgrade,
        can_upgrade_to           : client.can_upgrade_to,
        currency                 : client.currency,
        is_logged_in             : client.is_logged_in,
        is_logging_in            : client.is_logging_in,
        is_virtual               : client.is_virtual,
        enableApp                : ui.enableApp,
        is_acc_switcher_on       : ui.is_accounts_switcher_on,
        is_dark_mode             : ui.is_dark_mode_on,
        is_app_disabled          : ui.is_app_disabled,
        is_loading               : ui.is_loading,
        landing_company_shortcode: client.landing_company_shortcode,
        is_mt5_allowed           : client.is_mt5_allowed,
        notifications_count      : ui.notifications.length,
        is_notifications_visible : ui.is_notifications_visible,
        is_route_modal_on        : ui.is_route_modal_on,
        is_mobile                : ui.is_mobile,
        openRealAccountSignup    : ui.openRealAccountSignup,
        disableApp               : ui.disableApp,
        toggleAccountsDialog     : ui.toggleAccountsDialog,
        toggleNotifications      : ui.toggleNotificationsModal,
    })
)(withRouter(Header));
