import classNames               from 'classnames';
import PropTypes                from 'prop-types';
import React                    from 'react';
import { withRouter }           from 'react-router';
import {
    Icon,
    Money,
    Tabs,
    ThemedScrollbars }          from 'deriv-components';
import CurrencyUtils            from 'deriv-shared/utils/currency';
import { localize, Localize }   from 'deriv-translations';
import { urlFor }               from '_common/url';
import { connect }              from 'Stores/connect';
import routes                   from 'Constants/routes';
import { getMT5AccountDisplay } from 'Stores/Helpers/client';
import { AccountsItemLoader }   from 'App/Components/Layout/Header/Components/Preloader';
import AccountList              from './account-switcher-account-list.jsx';
import AccountWrapper           from './account-switcher-account-wrapper.jsx';
import ButtonAddAccount         from './account-switcher-add-account-button.jsx';

class AccountSwitcher extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active_tab_index     : props.is_virtual ? 1 : 0,
            is_demo_deriv_visible: true,
            is_demo_dmt5_visible : true,
            is_real_deriv_visible: true,
            is_real_dmt5_visible : true,
        };
    }

    toggleVisibility = (section) => {
        this.setState({ [`is_${section}_visible`]: !this.state[`is_${section}_visible`] });
    };

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    updateAccountTabIndex = (index) => {
        this.setState({ active_tab_index: index });
    }

    handleClickOutside = (event) => {
        const accounts_toggle_btn = !(event.target.classList.contains('acc-info'));
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)
            && this.props.is_visible && accounts_toggle_btn) {
            this.props.toggleAccountsDialog();
        }
    };

    handleLogout = () => {
        this.props.toggleAccountsDialog();
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
        if (!this.props.is_logged_in || this.props.is_mt5_allowed) {
            this.redirectToMt5('real');
        } else {
            window.open(urlFor('user/metatrader', undefined, undefined, true));
        }
    };

    redirectToMt5Demo = () => {
        this.redirectToMt5('demo');
    };

    setAccountCurrency = () => {
        this.props.toggleAccountsDialog();
        this.props.toggleSetCurrencyModal();
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
    }

    async doSwitch(loginid) {
        this.props.toggleAccountsDialog();
        if (this.props.account_loginid === loginid) return;
        await this.props.switchAccount(loginid);
    }

    get can_manage_currency() {
        return this.props.can_change_currency ||
            (!this.props.is_virtual && !this.props.has_fiat && this.props.can_upgrade_to);
    }

    get is_real_account_tab() {
        // Real accounts is always the first tab index based on design
        return this.props.active_tab_index === 0;
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

    get has_real_mt5_upgrade_button() {
        if (!this.props.mt5_login_list) return false;
        // TODO: Remove real account advanced string match when Real Account Advanced is enabled
        const real_mt5_accounts = this.props.mt5_login_list.filter((account)=> /^real((?!advanced).)*$/.test(account.group));
        return real_mt5_accounts.length < 2;
    }

    get has_demo_mt5_upgrade_button() {
        if (!this.props.mt5_login_list) return false;
        // TODO: Remove demo account advanced string match when Demo Account Advanced is enabled
        const demo_mt5_accounts = this.props.mt5_login_list.filter((account)=> /^demo((?!advanced).)*$/.test(account.group));
        return demo_mt5_accounts.length < 2;
    }

    get has_set_currency() {
        return this.props.account_list.filter(account => !account.is_virtual).some((account)=> account.title !== 'Real');
    }

    get can_upgrade() {
        return !!(this.props.is_upgrade_enabled && this.props.is_virtual && this.props.can_upgrade_to);
    }

    get has_add_button() {
        return this.can_upgrade || this.can_manage_currency;
    }

    get total_demo_assets() {
        const vrtc_loginid = this.props.account_list.find(account => account.is_virtual).loginid;
        const vrtc_balance = this.props.accounts[vrtc_loginid] ? this.props.accounts[vrtc_loginid].balance : 0;
        const mt5_demo_total = this.props.mt5_login_list
            .filter((account)=> /^demo/.test(account.group))
            .reduce((total, account) => {
                total.balance += account.balance;
                return total;
            }, { balance: 0 });
        return Array.isArray(this.props.mt5_login_list) ? (mt5_demo_total.balance + vrtc_balance) : vrtc_balance;
    }

    get total_real_assets() {
        return this.props.obj_total_balance.amount_real + this.props.obj_total_balance.amount_mt5;
    }

    render() {
        if (!this.props.is_logged_in) return false;

        const total_assets_message_demo = this.props.is_mt5_allowed ?
            localize('Total assets in your Deriv and DMT5 demo accounts.')
            : localize('Total assets in your Deriv demo accounts.');

        const total_assets_message_real =
            (this.props.is_mt5_allowed && this.props.has_any_real_account) ?
                localize('Total assets in your Deriv and DMT5 real accounts.')
                : localize('Total assets in your Deriv real accounts.');

        const total_assets_message = this.is_real_account_tab ?
            total_assets_message_real
            : total_assets_message_demo;

        return (
            <div className='acc-switcher__list' ref={this.setWrapperRef}>
                <Tabs
                    active_index={this.state.active_tab_index}
                    className='acc-switcher__list-tabs'
                    onTabItemClick={this.updateAccountTabIndex}
                    top
                >
                    {/* TODO: De-couple and refactor demo and real accounts groups
                        into a single reusable AccountListItem component */}
                    <div label={localize('Real')}>
                        <ThemedScrollbars
                            autoHeight
                            autoHide
                            autoHeightMax={354}
                            renderTrackHorizontal={props => <div {...props} className='track-horizontal' style={{ display: 'none' }} />}
                            renderThumbHorizontal={props => <div {...props} className='thumb-horizontal' style={{ display: 'none' }} />}
                        >
                            <div className='acc-switcher__list-wrapper'>
                                <div>
                                    <AccountWrapper
                                        header={<Localize i18n_default_text='Deriv Accounts' />}
                                        is_visible={this.state.is_real_deriv_visible}
                                        toggleVisibility={() => { this.toggleVisibility('real_deriv'); }}
                                    >
                                        <div className={classNames('acc-switcher__accounts', {
                                            'acc-switcher__accounts--has-add-account': this.has_add_button,
                                        })}
                                        >
                                            {this.sorted_account_list.filter(account => !account.is_virtual).map(
                                                (account) => (
                                                    <AccountList
                                                        key={account.loginid}
                                                        balance={this.props.accounts[account.loginid].balance}
                                                        currency={this.props.accounts[account.loginid].currency}
                                                        currency_icon={`IcCurrency-${account.icon}`}
                                                        display_type={'currency'}
                                                        has_balance={'balance' in this.props.accounts[account.loginid]}
                                                        is_disabled={account.is_disabled}
                                                        is_virtual={account.is_virtual}
                                                        loginid={account.loginid}
                                                        onClickAccount={account.is_disabled
                                                            ? undefined
                                                            : this.doSwitch.bind(this, account.loginid)}
                                                        selected_loginid={this.props.account_loginid}
                                                        setCurrency={() => {
                                                            this.props.toggleAccountsDialog();
                                                            this.props.openRealAccountSignup();
                                                        }}
                                                    />
                                                ))}
                                        </div>
                                        {this.has_add_button &&
                                        <ButtonAddAccount
                                            has_set_currency={
                                                !this.props.has_any_real_account ?
                                                    true
                                                    : this.has_set_currency
                                            }
                                            onClick={
                                                this.can_upgrade ?
                                                    this.onClickUpgrade
                                                    :
                                                    this.props.openRealAccountSignup
                                            }
                                            toggleSetCurrency={this.setAccountCurrency}
                                            text={<Localize i18n_default_text='Add Deriv account' />}
                                        />
                                        }
                                    </AccountWrapper>
                                </div>
                                {(this.props.is_mt5_allowed && this.props.has_any_real_account) &&
                                    <div>
                                        <div className='acc-switcher__separator acc-switcher__separator--no-padding' />
                                        <AccountWrapper
                                            header={<Localize i18n_default_text='DMT5 Accounts' />}
                                            is_visible={this.state.is_real_dmt5_visible}
                                            toggleVisibility={() => { this.toggleVisibility('real_dmt5'); }}
                                        >
                                            {this.props.is_loading_mt5 ?
                                                <div className='acc-switcher__accounts--is-loading'>
                                                    <AccountsItemLoader speed={3} />
                                                </div>
                                                :
                                                <React.Fragment>
                                                    {this.props.has_mt5_login &&
                                                        <div className={classNames('acc-switcher__accounts', {
                                                            'acc-switcher__accounts--has-add-account': this.has_real_mt5_upgrade_button,
                                                        })}
                                                        >
                                                            {this.sorted_mt5_list.filter((account)=> !(/^demo/.test(account.group))).map((account) => (
                                                                <AccountList
                                                                    key={account.login}
                                                                    account_type={account.group}
                                                                    balance={account.balance}
                                                                    currency={account.currency}
                                                                    currency_icon={`IcMt5-${getMT5AccountDisplay(account.group)}`}
                                                                    has_balance={'balance' in account}
                                                                    loginid={account.login}
                                                                    onClickAccount={this.redirectToMt5Real}
                                                                />
                                                            ))}
                                                        </div>
                                                    }
                                                    {(this.has_real_mt5_upgrade_button) &&
                                                    <ButtonAddAccount
                                                        has_set_currency={this.has_set_currency}
                                                        toggleSetCurrency={this.setAccountCurrency}
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
                    </div>
                    <div label={localize('Demo')}>
                        <ThemedScrollbars
                            autoHeight
                            autoHide
                            autoHeightMax={354}
                            renderTrackHorizontal={props => <div {...props} className='track-horizontal' style={{ display: 'none' }} />}
                            renderThumbHorizontal={props => <div {...props} className='thumb-horizontal' style={{ display: 'none' }} />}
                        >
                            <div className='acc-switcher__list-wrapper'>
                                <div>
                                    <AccountWrapper
                                        header={<Localize i18n_default_text='Deriv Accounts' />}
                                        is_visible={this.state.is_demo_deriv_visible}
                                        toggleVisibility={() => { this.toggleVisibility('demo_deriv'); }}
                                    >
                                        <div className='acc-switcher__accounts'>
                                            {this.sorted_account_list.filter(account => account.is_virtual).map(
                                                (account) => (
                                                    <AccountList
                                                        key={account.loginid}
                                                        balance={this.props.accounts[account.loginid].balance}
                                                        currency={this.props.accounts[account.loginid].currency}
                                                        currency_icon={`IcCurrency-${account.icon}`}
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
                                    </AccountWrapper>
                                </div>
                                {this.props.is_mt5_allowed &&
                                    <div>
                                        <div className='acc-switcher__separator acc-switcher__separator--no-padding' />
                                        <AccountWrapper
                                            header={<Localize i18n_default_text='DMT5 Accounts' />}
                                            is_visible={this.state.is_demo_dmt5_visible}
                                            toggleVisibility={() => { this.toggleVisibility('demo_dmt5'); }}
                                        >
                                            {this.props.is_loading_mt5 ?
                                                <div className='acc-switcher__accounts--is-loading'>
                                                    <AccountsItemLoader speed={3} />
                                                </div>
                                                :
                                                <React.Fragment>
                                                    {this.props.has_mt5_login &&
                                                        <div className={classNames('acc-switcher__accounts', {
                                                            'acc-switcher__accounts--has-add-account': this.has_demo_mt5_upgrade_button,
                                                        })}
                                                        >
                                                            {this.sorted_mt5_list.filter((account)=> /^demo/.test(account.group)).map((account) => (
                                                                <AccountList
                                                                    key={account.login}
                                                                    account_type={account.group}
                                                                    balance={account.balance}
                                                                    currency={account.currency}
                                                                    currency_icon={`IcMt5-${getMT5AccountDisplay(account.group)}`}
                                                                    has_balance={'balance' in account}
                                                                    is_virtual
                                                                    loginid={account.login}
                                                                    onClickAccount={this.redirectToMt5Demo}
                                                                />
                                                            ))}
                                                        </div>
                                                    }
                                                    {(this.has_demo_mt5_upgrade_button) &&
                                                    <ButtonAddAccount
                                                        is_currency_required={false}
                                                        onClick={this.redirectToMt5Demo}
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
                    </div>
                </Tabs>
                <div className='acc-switcher__separator' />
                <div className='acc-switcher__total'>
                    <span>
                        <Localize i18n_default_text='Total assets' />
                    </span>
                    <span className={classNames('acc-switcher__balance', { 'acc-switcher__balance--virtual': !this.is_real_account_tab })}>
                        <Money
                            currency={this.is_real_account_tab ? this.props.obj_total_balance.currency : 'USD'}
                            amount={CurrencyUtils.formatMoney(
                                this.is_real_account_tab ? this.props.obj_total_balance.currency : 'USD',
                                this.is_real_account_tab ? this.total_real_assets : this.total_demo_assets,
                                true,
                            )}
                            should_format={false}
                        />
                    </span>
                </div>
                <div className='acc-switcher__total-subtitle'>
                    <span>
                        {total_assets_message}
                    </span>
                </div>
                <div className='acc-switcher__separator' />
                <div id='dt_logout_button' className='acc-switcher__logout'>
                    <span className='acc-switcher__logout-text' onClick={this.handleLogout}>{localize('Log out')}</span>
                    <Icon icon='IcLogout' className='acc-switcher__logout-icon drawer__icon' onClick={this.handleLogout} />
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
    has_any_real_account  : PropTypes.bool,
    has_fiat              : PropTypes.bool,
    has_mt5_login         : PropTypes.bool,
    is_loading_mt5        : PropTypes.bool,
    is_logged_in          : PropTypes.bool,
    is_mt5_allowed        : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_upgrade_enabled    : PropTypes.bool,
    is_virtual            : PropTypes.bool,
    is_visible            : PropTypes.bool,
    mt5_login_list        : PropTypes.array,
    obj_total_balance     : PropTypes.object,
    toggleAccountsDialog  : PropTypes.func,
    togglePositionsDrawer : PropTypes.func,
    toggleSetCurrencyModal: PropTypes.func,
    updateMt5LoginList    : PropTypes.func,
};

const account_switcher = withRouter(connect(
    ({ client, ui }) => ({
        account_loginid          : client.loginid,
        accounts                 : client.accounts,
        has_fiat                 : client.has_fiat,
        can_change_currency      : client.can_change_currency,
        account_list             : client.account_list,
        can_upgrade              : client.can_upgrade,
        can_upgrade_to           : client.can_upgrade_to,
        has_mt5_login            : client.has_mt5_login,
        is_loading_mt5           : client.is_populating_mt5_account_list,
        is_logged_in             : client.is_logged_in,
        is_mt5_allowed           : client.is_mt5_allowed,
        is_virtual               : client.is_virtual,
        has_any_real_account     : client.has_any_real_account,
        landing_company_shortcode: client.landing_company_shortcode,
        mt5_login_list           : client.mt5_login_list,
        obj_total_balance        : client.obj_total_balance,
        switchAccount            : client.switchAccount,
        logoutClient             : client.logout,
        updateMt5LoginList       : client.updateMt5LoginList,
        is_positions_drawer_on   : ui.is_positions_drawer_on,
        openRealAccountSignup    : ui.openRealAccountSignup,
        toggleAccountsDialog     : ui.toggleAccountsDialog,
        togglePositionsDrawer    : ui.togglePositionsDrawer,
        toggleSetCurrencyModal   : ui.toggleSetCurrencyModal,
    }),
)(AccountSwitcher));

export { account_switcher as AccountSwitcher };
