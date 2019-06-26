import classNames      from 'classnames';
import PropTypes       from 'prop-types';
import React           from 'react';
import { withRouter }  from 'react-router';
import { formatMoney } from '_common/base/currency_base';
import { urlFor }      from '_common/url';
import {
    AccountInfo,
    DepositButton,
    LoginButton,
    MenuLinks,
    SignupButton,
    ToggleMenuDrawer,
    UpgradeButton }    from 'App/Components/Layout/Header';
import header_links    from 'App/Constants/header-links';
import routes          from 'Constants/routes';
import { connect }     from 'Stores/connect';

const Header = ({
    balance,
    can_upgrade,
    can_upgrade_to,
    currency,
    is_acc_switcher_on,
    is_fully_blurred,
    is_loading,
    is_logged_in,
    is_mobile,
    is_route_blurred,
    is_virtual,
    location,
    loginid,
    onClickUpgrade,
    toggleAccountsDialog,
}) => (
    <React.Fragment>
        {(!is_loading || location.pathname !== routes.trade) &&
            <header className={classNames('header', {
                'header--is-blurred': (is_fully_blurred || is_route_blurred),
            })}
            >
                <div className='header__menu-items'>
                    <div className='header__menu-left'>
                        {is_mobile && <ToggleMenuDrawer />}
                        <MenuLinks
                            is_logged_in={is_logged_in}
                            items={header_links}
                        />
                    </div>
                    <div className='header__menu-right'>
                        <div className='acc-info__container'>
                            { is_logged_in ?
                                <React.Fragment>
                                    <AccountInfo
                                        balance={formatMoney(currency, balance, true)}
                                        is_upgrade_enabled={can_upgrade}
                                        is_virtual={is_virtual}
                                        onClickUpgrade={onClickUpgrade}
                                        currency={currency}
                                        loginid={loginid}
                                        is_dialog_on={is_acc_switcher_on}
                                        toggleDialog={toggleAccountsDialog}
                                    />
                                    { !!(can_upgrade_to && is_virtual) &&
                                    <UpgradeButton
                                        className='acc-info__button'
                                        onClick={() => {
                                            window.open(urlFor('user/accounts', undefined, undefined, true));
                                        }}
                                    />
                                    }
                                    { !(is_virtual) &&
                                    <DepositButton className='acc-info__button' />
                                    }
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <LoginButton className='acc-info__button' />
                                    <SignupButton className='acc-info__button' />
                                </React.Fragment>
                            }
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
    is_acc_switcher_on  : PropTypes.bool,
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
    toggleAccountsDialog: PropTypes.func,
};

// need to wrap withRouter around connect
// to prevent updates on <MenuLinks /> from being blocked
export default withRouter(connect(
    ({ client, ui }) => ({
        balance             : client.balance,
        can_upgrade         : client.can_upgrade,
        can_upgrade_to      : client.can_upgrade_to,
        currency            : client.currency,
        is_loading          : ui.is_loading,
        is_logged_in        : client.is_logged_in,
        is_virtual          : client.is_virtual,
        loginid             : client.loginid,
        is_acc_switcher_on  : ui.is_accounts_switcher_on,
        is_dark_mode        : ui.is_dark_mode_on,
        is_fully_blurred    : ui.is_fully_blurred,
        is_route_blurred    : ui.is_route_blurred,
        is_mobile           : ui.is_mobile,
        toggleAccountsDialog: ui.toggleAccountsDialog,
    })
)(Header));
