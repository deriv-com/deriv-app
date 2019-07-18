import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import {
    AccountActions,
    MenuLinks,
    // ToggleCashier,
}                     from 'App/Components/Layout/Header';
import header_links   from 'App/Constants/header-links';
import Lazy           from 'App/Containers/Lazy';
import routes         from 'Constants/routes';
import { connect }    from 'Stores/connect';

const Header = ({
    balance,
    can_upgrade,
    can_upgrade_to,
    currency,
    // hideFullBlur,
    is_acc_switcher_on,
    // is_cashier_modal_on,
    is_fully_blurred,
    is_loading,
    is_logged_in,
    is_mobile,
    is_route_blurred,
    is_virtual,
    location,
    loginid,
    onClickUpgrade,
    // showFullBlur,
    toggleAccountsDialog,
    // toggleCashierModal,
}) => (
    <React.Fragment>
        {(!is_loading || location.pathname !== routes.trade) &&
            <header className={classNames('header', {
                'header--is-blurred': (is_fully_blurred || is_route_blurred),
            })}
            >
                <div className='header__menu-items'>
                    <div className='header__menu-left'>
                        <Lazy
                            has_progress={false}
                            ctor={() => import(/* webpackChunkName: "toggle-menu-drawer" */'App/Components/Layout/Header/toggle-menu-drawer.jsx')}
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
                                is_logged_in={is_logged_in}
                                currency={currency}
                                balance={balance}
                                can_upgrade={can_upgrade}
                                is_virtual={is_virtual}
                                onClickUpgrade={onClickUpgrade}
                                loginid={loginid}
                                is_acc_switcher_on={is_acc_switcher_on}
                                toggleAccountsDialog={toggleAccountsDialog}
                                can_upgrade_to={can_upgrade_to}
                            />
                        </div>
                    </div>
                </div>
            </header>
        }
    </React.Fragment>
);

Header.propTypes = {
    balance             : PropTypes.string,
    can_upgrade         : PropTypes.bool,
    can_upgrade_to      : PropTypes.string,
    currency            : PropTypes.string,
    hideFullBlur        : PropTypes.func,
    is_acc_switcher_on  : PropTypes.bool,
    is_cashier_modal_on : PropTypes.bool,
    is_dark_mode        : PropTypes.bool,
    is_fully_blurred    : PropTypes.bool,
    is_loading          : PropTypes.bool,
    is_logged_in        : PropTypes.bool,
    is_mobile           : PropTypes.bool,
    is_route_blurred    : PropTypes.bool,
    is_virtual          : PropTypes.bool,
    location            : PropTypes.object,
    loginid             : PropTypes.string,
    onClickUpgrade      : PropTypes.func,
    showFullBlur        : PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
    toggleCashierModal  : PropTypes.func,
};

// need to wrap withRouter around connect
// to prevent updates on <MenuLinks /> from being blocked
export default withRouter(connect(
    ({ client, ui }) => ({
        balance             : client.balance,
        can_upgrade         : client.can_upgrade,
        can_upgrade_to      : client.can_upgrade_to,
        currency            : client.currency,
        hideFullBlur        : ui.hideFullBlur,
        is_loading          : ui.is_loading,
        is_logged_in        : client.is_logged_in,
        is_virtual          : client.is_virtual,
        loginid             : client.loginid,
        is_acc_switcher_on  : ui.is_accounts_switcher_on,
        is_cashier_modal_on : ui.is_cashier_modal_on,
        is_dark_mode        : ui.is_dark_mode_on,
        is_fully_blurred    : ui.is_fully_blurred,
        is_route_blurred    : ui.is_route_blurred,
        is_mobile           : ui.is_mobile,
        showFullBlur        : ui.showFullBlur,
        toggleAccountsDialog: ui.toggleAccountsDialog,
        toggleCashierModal  : ui.toggleCashierModal,
    })
)(Header));
