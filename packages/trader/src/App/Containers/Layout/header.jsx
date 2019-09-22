import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import {
    AccountActions,
    MenuLinks,
}                        from 'App/Components/Layout/Header';
import header_links      from 'App/Constants/header-links';
import Lazy              from 'App/Containers/Lazy';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import { connect }       from 'Stores/connect';

const Header = ({
    active_cashier_tab,
    balance,
    can_upgrade,
    can_upgrade_to,
    currency,
    enableApp,
    is_acc_switcher_on,
    is_cashier_modal_on,
    is_app_disabled,
    is_logged_in,
    is_mobile,
    is_payment_agent_visible,
    is_route_modal_on,
    is_virtual,
    loginid,
    onClickUpgrade,
    disableApp,
    setCashierActiveTab,
    toggleAccountsDialog,
    toggleCashierModal,
}) => (
    <header className={classNames('header', {
        'header--is-disabled': (is_app_disabled || is_route_modal_on),
    })}
    >
        <div className='header__menu-items'>
            <div className='header__menu-left'>
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
                <div className='acc-info__container'>
                    <AccountActions
                        active_cashier_tab={active_cashier_tab}
                        balance={balance}
                        can_upgrade_to={can_upgrade_to}
                        currency={currency}
                        can_upgrade={can_upgrade}
                        disableApp={disableApp}
                        enableApp={enableApp}
                        is_acc_switcher_on={is_acc_switcher_on}
                        is_cashier_modal_on={is_cashier_modal_on}
                        is_payment_agent_visible={is_payment_agent_visible}
                        is_logged_in={is_logged_in}
                        is_virtual={is_virtual}
                        loginid={loginid}
                        onClickUpgrade={onClickUpgrade}
                        setCashierActiveTab={setCashierActiveTab}
                        toggleAccountsDialog={toggleAccountsDialog}
                        toggleCashierModal={toggleCashierModal}
                    />
                </div>
            </div>
        </div>
        <RealAccountSignup />
    </header>
);

Header.propTypes = {
    active_cashier_tab      : PropTypes.string,
    balance                 : PropTypes.string,
    can_upgrade             : PropTypes.bool,
    can_upgrade_to          : PropTypes.string,
    currency                : PropTypes.string,
    disableApp              : PropTypes.func,
    enableApp               : PropTypes.func,
    is_acc_switcher_on      : PropTypes.bool,
    is_app_disabled         : PropTypes.bool,
    is_cashier_modal_on     : PropTypes.bool,
    is_dark_mode            : PropTypes.bool,
    is_logged_in            : PropTypes.bool,
    is_mobile               : PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_route_modal_on       : PropTypes.bool,
    is_virtual              : PropTypes.bool,
    loginid                 : PropTypes.string,
    onClickUpgrade          : PropTypes.func,
    setCashierActiveTab     : PropTypes.func,
    toggleAccountsDialog    : PropTypes.func,
    toggleCashierModal      : PropTypes.func,
};

export default connect(
    ({ client, modules, ui }) => ({
        active_cashier_tab      : ui.active_cashier_tab,
        balance                 : client.balance,
        can_upgrade             : client.can_upgrade,
        can_upgrade_to          : client.can_upgrade_to,
        currency                : client.currency,
        is_logged_in            : client.is_logged_in,
        is_virtual              : client.is_virtual,
        loginid                 : client.loginid,
        enableApp               : ui.enableApp,
        is_acc_switcher_on      : ui.is_accounts_switcher_on,
        is_cashier_modal_on     : ui.is_cashier_modal_on,
        is_dark_mode            : ui.is_dark_mode_on,
        is_app_disabled         : ui.is_app_disabled,
        is_loading              : ui.is_loading,
        is_payment_agent_visible:
            !!(modules.cashier.config.payment_agent.list.length || modules.cashier.config.payment_agent.agents.length),
        is_route_modal_on   : ui.is_route_modal_on,
        is_mobile           : ui.is_mobile,
        disableApp          : ui.disableApp,
        setCashierActiveTab : ui.setCashierActiveTab,
        toggleAccountsDialog: ui.toggleAccountsDialog,
        toggleCashierModal  : ui.toggleCashierModal,
    })
)(Header);
