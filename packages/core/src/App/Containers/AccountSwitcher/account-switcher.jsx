import classNames             from 'classnames';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { withRouter }         from 'react-router';
import {
    Money,
    Popover,
    ThemedScrollbars }        from 'deriv-components';
import CurrencyUtils          from 'deriv-shared/utils/currency';
import { localize, Localize } from 'deriv-translations';
import { urlFor }             from '_common/url';
import UpgradeButton          from 'App/Containers/RealAccountSignup/upgrade-button.jsx';
import Icon                   from 'Assets/icon.jsx';
import { connect }            from 'Stores/connect';
import routes                 from 'Constants/routes';
import {
    getMT5AccountDisplay,
    getMT5AccountType }       from 'Stores/Helpers/client';
import Loading                from '../../../templates/_common/components/loading.jsx';

const AccountWrapper = ({
    children,
    header,
    is_visible,
    toggleVisibility,
}) => (
    <React.Fragment>
        <div
            className={classNames('acc-switcher', { 'acc-info--show': !is_visible })}
            onClick={toggleVisibility}
        >
            <span className='acc-switcher__list-title'>
                {header}
            </span>
            <Icon icon='IconArrow' className='acc-info__select-arrow' />
        </div>
        {is_visible &&
            <React.Fragment>
                {children}
            </React.Fragment>
        }
    </React.Fragment>
);

const AccountList = ({
    account_type,
    balance,
    currency,
    currency_icon,
    display_type,
    has_balance,
    has_demo_text,
    is_disabled,
    is_virtual,
    loginid,
    onClickAccount,
    selected_loginid,
}) => (
    <Popover alignment='left' message={loginid}>
        <div
            id={`dt_${loginid}`}
            className={classNames('acc-switcher__account', {
                'acc-switcher__account--selected' : loginid === selected_loginid,
                'acc-switcher__account--disabled' : is_disabled,
                'acc-switcher__account--demo-text': has_demo_text,
            })}
            onClick={is_disabled ? undefined : onClickAccount}
        >
            <span className={'acc-switcher__id'}>
                <Icon
                    icon='IconAccountsCurrency'
                    className={`acc-switcher__id-icon acc-switcher__id-icon--${currency_icon}`}
                    type={currency_icon}
                />
                <span>
                    {display_type === 'currency'
                        ? <CurrencyDisplay is_virtual={is_virtual} currency={currency_icon} />
                        : <AccountDisplay is_virtual={has_demo_text} account_type={account_type} />
                    }
                </span>
                {has_balance &&
                <span className={classNames('acc-switcher__balance', { 'acc-switcher__balance--virtual': is_virtual || has_demo_text })}>
                    {currency &&
                    <Money
                        currency={currency}
                        amount={CurrencyUtils.formatMoney(currency, balance, true)}
                        should_format={false}
                    />
                    }
                    {!currency &&
                    <span className='no-currency'>
                        <Localize i18n_default_text='No currency assigned' />
                    </span>
                    }
                </span>
                }
            </span>
        </div>
    </Popover>
);

const CurrencyDisplay = ({
    currency,
    is_virtual,
}) => {
    if (is_virtual) {
        return <Localize i18n_default_text='Demo' />;
    }
    if (currency.toUpperCase() === 'REAL') {
        return <Localize i18n_default_text='Real' />;
    }
    return currency.toUpperCase();
};

const AccountDisplay = ({
    account_type,
    is_virtual,
}) => (
    <React.Fragment>
        {is_virtual &&
        <div className='acc-switcher__demo-text'>
            <Localize i18n_default_text='Demo' />
        </div>
        }
        <div>
            {getMT5AccountDisplay(account_type)}
        </div>
    </React.Fragment>
);

const ButtonAddAccount = ({
    onClick,
    text,
}) => (
    <UpgradeButton
        onClick={onClick}
        icon={<Icon icon='IconAdd' />}
    >
        {text}
    </UpgradeButton>
);

class AccountSwitcher extends React.Component {
    state = {
        is_deriv_visible: true,
        is_dmt5_visible : true,
    };

    toggleVisibility = (section) => {
        this.setState({ [`is_${section}_visible`]: !this.state[`is_${section}_visible`] });
    };

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        const accounts_toggle_btn = !(event.target.classList.contains('acc-info'));
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)
            && this.props.is_visible && accounts_toggle_btn) {
            this.props.toggle();
        }
    };

    handleLogout = () => {
        this.props.toggle();
        if (this.props.is_positions_drawer_on) {
            this.props.togglePositionsDrawer(); // TODO: hide drawer inside logout, once it is a mobx action
        }
        this.props.logoutClient();
    };

    redirectToMt5 = (account_type) => {
        this.props.toggleAccountsDialog();
        this.props.history.push(`${routes.mt5}#${account_type}`);
    };

    redirectToMt5Real = () => {
        this.redirectToMt5('real');
    };

    redirectToMt5Demo = () => {
        this.redirectToMt5('demo');
    };

    onClickUpgrade = () => {
        if (this.props.can_upgrade_to === 'svg') {
            this.props.openRealAccountSignup();
        } else {
            window.open(urlFor('new_account/maltainvestws', undefined, undefined, true));
        }
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.props.updateMt5LoginList();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        this.props.hideDialog();
    }

    async doSwitch(loginid) {
        this.props.toggle();
        if (this.props.account_loginid === loginid) return;
        await this.props.switchAccount(loginid);
    }

    get can_manage_currency () {
        return this.props.can_change_currency ||
            (!this.props.is_virtual && !this.props.has_fiat && this.props.can_upgrade_to);
    }

    get sorted_account_list() {
        // sort accounts as follows:
        // top is fiat, then crypto (each alphabetically by currency), then demo
        return this.props.account_list.slice().sort((a, b) => {
            const a_currency = this.props.accounts[a.loginid].currency;
            const b_currency = this.props.accounts[b.loginid].currency;
            const a_is_crypto = CurrencyUtils.isCryptocurrency(a_currency);
            const b_is_crypto = CurrencyUtils.isCryptocurrency(b_currency);
            const a_is_fiat = !a_is_crypto;
            const b_is_fiat = !b_is_crypto;
            if (a.is_virtual || b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if ((a_is_crypto && b_is_crypto) || (a_is_fiat && b_is_fiat)) {
                return a_currency < b_currency ? -1 : 1;
            } else if (a_is_fiat && b_is_crypto) {
                return -1;
            }
            return 1;
        });
    }

    get sorted_mt5_list() {
        // for MT5, standard, advanced, then synthetic indices
        return this.props.mt5_login_list.slice().sort((a, b) => {
            if (/demo/.test(a.group) && !/demo/.test(b.group)) {
                return 1;
            }
            if (/demo/.test(b.group) && !/demo/.test(a.group)) {
                return -1;
            }
            if (/vanuatu/.test(a.group)) {
                return -1;
            }
            if (/svg/.test(a.group)) {
                return 1;
            }
            return -1;
        });
    }

    get can_upgrade () {
        return !!(this.props.is_upgrade_enabled && this.props.is_virtual && this.props.can_upgrade_to);
    }

    get has_add_button() {
        return this.can_upgrade || this.can_manage_currency;
    }

    get total_assets() {
        return this.props.obj_total_balance.amount_real + this.props.obj_total_balance.amount_mt5;
    }

    render() {
        if (!this.props.is_logged_in) return false;

        return (
            <div className='acc-switcher__list' ref={this.setWrapperRef} style={{ display: this.props.display }}>
                <ThemedScrollbars
                    autoHeight
                    autoHide
                    autoHeightMax={462}
                    renderTrackHorizontal={props => <div {...props} className='track-horizontal' style={{ display: 'none' }} />}
                    renderThumbHorizontal={props => <div {...props} className='thumb-horizontal' style={{ display: 'none' }} />}
                >
                    <div className='acc-switcher__list-wrapper'>
                        <div>
                            <AccountWrapper
                                header={<Localize i18n_default_text='Deriv Accounts' />}
                                is_visible={this.state.is_deriv_visible}
                                toggleVisibility={() => { this.toggleVisibility('deriv'); }}
                            >
                                <div className='acc-switcher__accounts'>
                                    {this.sorted_account_list.map((account) => (
                                        <AccountList
                                            key={account.loginid}
                                            balance={this.props.accounts[account.loginid].balance}
                                            currency={this.props.accounts[account.loginid].currency}
                                            currency_icon={account.icon}
                                            display_type={'currency'}
                                            has_balance={'balance' in this.props.accounts[account.loginid]}
                                            is_disabled={account.is_disabled}
                                            is_virtual={account.is_virtual}
                                            loginid={account.loginid}
                                            onClickAccount={account.is_disabled
                                                ? undefined
                                                : this.doSwitch.bind(this, account.loginid)}
                                            selected_loginid={this.props.account_loginid}
                                        />
                                    ))}
                                </div>
                                {this.has_add_button &&
                                <ButtonAddAccount
                                    onClick={this.can_upgrade ? this.onClickUpgrade : this.props.openRealAccountSignup}
                                    text={<Localize i18n_default_text='Add Deriv account' />}
                                />
                                }
                            </AccountWrapper>
                        </div>
                        {this.props.is_mt5_allowed &&
                            <div>
                                <AccountWrapper
                                    header={<Localize i18n_default_text='DMT5 Accounts' />}
                                    is_visible={this.state.is_dmt5_visible}
                                    toggleVisibility={() => { this.toggleVisibility('dmt5'); }}
                                >
                                    {this.props.is_loading_mt5 ?
                                        <Loading className='acc-switcher__loader' />
                                        :
                                        <React.Fragment>
                                            {this.props.has_mt5_login ?
                                                <div className='acc-switcher__accounts'>
                                                    {this.sorted_mt5_list.map((account) => (
                                                        <AccountList
                                                            key={account.login}
                                                            account_type={account.group}
                                                            balance={account.balance}
                                                            currency={account.currency}
                                                            currency_icon={getMT5AccountType(account.group).replace(/^demo/, 'real')}
                                                            has_balance={'balance' in account}
                                                            has_demo_text={/^demo/.test(account.group)}
                                                            loginid={account.login}
                                                            onClickAccount={/^demo/.test(account.group) ? this.redirectToMt5Demo : this.redirectToMt5Real}
                                                        />
                                                    ))}
                                                </div>
                                                :
                                                <ButtonAddAccount
                                                    onClick={this.redirectToMt5Real}
                                                    text={<Localize i18n_default_text='Add DMT5 account' />}
                                                />
                                            }
                                        </React.Fragment>
                                    }
                                </AccountWrapper>
                            </div>
                        }
                    </div>
                </ThemedScrollbars>

                <div className='acc-switcher__separator' />

                <div className='acc-switcher__total'>
                    <span>
                        <Localize i18n_default_text='Total assets' />
                    </span>
                    <Popover
                        alignment='bottom'
                        message={this.props.has_mt5_login
                            ? localize('Total assets in your Deriv and DMT5 accounts (excluding demo accounts).')
                            : localize('Total assets in your Deriv accounts (excluding demo accounts).')
                        }
                    >
                        <Icon icon='IconInfoOutline' className='acc-switcher__total-icon' />
                    </Popover>
                    <span className='acc-switcher__balance'>
                        <Money
                            currency={this.props.obj_total_balance.currency}
                            amount={
                                CurrencyUtils.formatMoney(
                                    this.props.obj_total_balance.currency,
                                    this.total_assets,
                                    true
                                )
                            }
                            should_format={false}
                        />
                    </span>
                </div>

                <div className='acc-switcher__separator' />

                <div id='dt_logout_button' className='acc-switcher__logout' onClick={this.handleLogout}>
                    <span className='acc-switcher__logout-text'>{localize('Log out')}</span>
                    <Icon icon='IconLogout' className='acc-switcher__logout-icon drawer__icon' />
                </div>
            </div>
        );
    }
}

AccountSwitcher.propTypes = {
    account_list          : PropTypes.array,
    account_loginid       : PropTypes.string,
    accounts              : PropTypes.object,
    display               : PropTypes.string,
    has_fiat              : PropTypes.bool,
    has_mt5_login         : PropTypes.bool,
    hideDialog            : PropTypes.func,
    is_loading_mt5        : PropTypes.bool,
    is_logged_in          : PropTypes.bool,
    is_mt5_allowed        : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_upgrade_enabled    : PropTypes.bool,
    is_virtual            : PropTypes.bool,
    is_visible            : PropTypes.bool,
    mt5_login_list        : PropTypes.array,
    obj_total_balance     : PropTypes.object,
    toggle                : PropTypes.func,
    toggleAccountsDialog  : PropTypes.func,
    togglePositionsDrawer : PropTypes.func,
    updateMt5LoginList    : PropTypes.func,
};

const account_switcher = withRouter(connect(
    ({ client, ui }) => ({
        account_loginid       : client.loginid,
        accounts              : client.accounts,
        has_fiat              : client.has_fiat,
        can_change_currency   : client.can_change_currency,
        account_list          : client.account_list,
        can_upgrade           : client.can_upgrade,
        can_upgrade_to        : client.can_upgrade_to,
        has_mt5_login         : client.has_mt5_login,
        is_loading_mt5        : client.is_populating_mt5_account_list,
        is_logged_in          : client.is_logged_in,
        is_mt5_allowed        : client.is_mt5_allowed,
        is_virtual            : client.is_virtual,
        mt5_login_list        : client.mt5_login_list,
        obj_total_balance     : client.obj_total_balance,
        switchAccount         : client.switchAccount,
        logoutClient          : client.logout,
        updateMt5LoginList    : client.updateMt5LoginList,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        openRealAccountSignup : ui.openRealAccountSignup,
        toggleAccountsDialog  : ui.toggleAccountsDialog,
        togglePositionsDrawer : ui.togglePositionsDrawer,
    }),
)(AccountSwitcher));

export { account_switcher as AccountSwitcher };
