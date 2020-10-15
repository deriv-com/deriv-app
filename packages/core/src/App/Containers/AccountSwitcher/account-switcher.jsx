import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import {
    Button,
    DesktopWrapper,
    MobileWrapper,
    Div100vhContainer,
    Icon,
    Money,
    Tabs,
    ThemedScrollbars,
} from '@deriv/components';
import { urlFor, routes, isCryptocurrency, formatMoney, getMT5Account } from '@deriv/shared';

import { localize, Localize } from '@deriv/translations';
import { getAccountTitle } from 'App/Containers/RealAccountSignup/helpers/constants';
import { connect } from 'Stores/connect';
import { AccountsItemLoader } from 'App/Components/Layout/Header/Components/Preloader';
import AccountList from './account-switcher-account-list.jsx';
import AccountWrapper from './account-switcher-account-wrapper.jsx';

class AccountSwitcher extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active_tab_index: props.is_virtual ? 1 : 0,
            is_demo_deriv_visible: true,
            is_demo_dmt5_visible: true,
            is_real_deriv_visible: true,
            is_real_dmt5_visible: true,
            has_autohide: true,
        };
    }

    toggleVisibility = section => {
        this.setState({ [`is_${section}_visible`]: !this.state[`is_${section}_visible`] });
    };

    setWrapperRef = node => {
        this.wrapper_ref = node;
    };

    updateAccountTabIndex = index => {
        this.setState({ active_tab_index: index });
    };

    handleClickOutside = event => {
        const accounts_toggle_btn = !event.target.classList.contains('acc-info');
        if (
            this.wrapper_ref &&
            !this.wrapper_ref.contains(event.target) &&
            this.props.is_visible &&
            accounts_toggle_btn
        ) {
            this.closeAccountsDialog();
        }
    };

    handleLogout = () => {
        this.closeAccountsDialog();
        if (this.props.is_positions_drawer_on) {
            this.props.togglePositionsDrawer(); // TODO: hide drawer inside logout, once it is a mobx action
        }
        this.props.logoutClient().then(() => {
            this.props.routeBackInApp(this.props.history);
        });
    };

    closeAccountsDialog = () => {
        this.props.toggleAccountsDialog(false);
    };

    redirectToMt5 = account_type => {
        this.closeAccountsDialog();
        this.props.history.push(`${routes.mt5}#${account_type}`);
    };

    openMt5RealAccount = account_type => {
        const has_required_account =
            account_type === 'synthetic' ? this.props.has_malta_account : this.props.has_maltainvest_account;

        if (this.props.is_eu_enabled && this.props.is_eu && !has_required_account) {
            // TODO [deriv-eu] remove is_eu_enabled check once EU is ready for production
            this.closeAccountsDialog();
            this.props.openAccountNeededModal(
                account_type === 'synthetic'
                    ? this.props.standpoint.gaming_company
                    : this.props.standpoint.financial_company,
                account_type === 'synthetic' ? localize('Deriv Synthetic') : localize('Deriv Financial'),
                account_type === 'synthetic' ? localize('DMT5 Synthetic') : localize('DMT5 Financial')
            );
        } else {
            sessionStorage.setItem('open_mt5_account_type', `real.${account_type}`);
            this.redirectToMt5Real();
        }
    };

    redirectToMt5Real = () => {
        if (!this.props.is_logged_in || this.props.is_mt5_allowed) {
            this.redirectToMt5('real');
        } else {
            window.open(urlFor('user/metatrader', { legacy: true }));
        }
    };

    onListEnter = () => this.setState({ has_autohide: false });

    onListLeave = () => this.setState({ has_autohide: true });

    openMt5DemoAccount = account_type => {
        sessionStorage.setItem('open_mt5_account_type', `demo.${account_type}`);
        this.redirectToMt5Demo();
    };

    redirectToMt5Demo = () => {
        this.redirectToMt5('demo');
    };

    setAccountCurrency = () => {
        this.closeAccountsDialog();
        this.props.toggleSetCurrencyModal();
    };

    showAccountTypesModal = () => {
        this.closeAccountsDialog();
        this.props.toggleAccountTypesModal(true);
    };

    onClickUpgrade = account => {
        // TODO [deriv-eu] remove is_eu_enabled check once EU is ready for production
        const is_account_signup_supported = this.props.is_eu ? this.props.is_eu_enabled : !this.props.is_eu;
        if (is_account_signup_supported) {
            this.props.openRealAccountSignup(account);
        } else {
            window.open(urlFor('user/accounts', { legacy: true })); // TODO [deriv-eu] Remove this before launching eu production
        }
    };

    isDemo = account => /^demo/.test(account.group);

    isReal = account => !this.isDemo(account);

    getRemainingAccounts = existing_mt5_groups => {
        const byAvailableCompanies = config_item => {
            const [company, type] = config_item.api_key.split('.');
            return !!this.props.landing_companies?.[company]?.[type];
        };

        const mt5_config = [
            {
                account_types: ['svg', 'malta'],
                icon: 'Synthetic',
                title: localize('Synthetic'),
                type: 'synthetic',
                api_key: 'mt_gaming_company.financial',
            },
            {
                // TODO: [remove-standard-advanced] remove standard when API groups are updated
                account_types: ['vanuatu', 'svg_standard', 'svg_financial', 'maltainvest_financial'],
                icon: 'Financial',
                title: localize('Financial'),
                type: 'financial',
                api_key: 'mt_financial_company.financial',
            },
            {
                account_types: ['labuan'],
                icon: 'Financial STP',
                title: localize('Financial STP'),
                type: 'financial_stp',
                api_key: 'mt_financial_company.financial_stp',
            },
        ];

        existing_mt5_groups.forEach(group => {
            const type = group.split(/[demo|real]_/)[1];
            const index_to_remove = mt5_config.findIndex(account => account.account_types.indexOf(type) > -1);
            mt5_config.splice(index_to_remove, 1);
        });

        return mt5_config.filter(byAvailableCompanies);
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.props.updateMt5LoginList();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    async doSwitch(loginid) {
        this.closeAccountsDialog();
        if (this.props.account_loginid === loginid) return;
        await this.props.switchAccount(loginid);
    }

    get is_real_account_tab() {
        // Real accounts is always the first tab index based on design
        return this.state.active_tab_index === 0;
    }

    get sorted_account_list() {
        // sort accounts as follows:
        // top is fiat, then crypto (each alphabetically by currency), then demo
        return this.props.account_list.slice().sort((a, b) => {
            const a_currency = this.props.accounts[a.loginid].currency;
            const b_currency = this.props.accounts[b.loginid].currency;
            const a_is_crypto = isCryptocurrency(a_currency);
            const b_is_crypto = isCryptocurrency(b_currency);
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
        // for MT5, synthetic, financial, financial stp
        return this.props.mt5_login_list.slice().sort((a, b) => {
            if (/demo/.test(a.group) && !/demo/.test(b.group)) {
                return 1;
            }
            if (/demo/.test(b.group) && !/demo/.test(a.group)) {
                return -1;
            }
            if (/svg$/.test(a.group)) {
                return -1;
            }
            // TODO: [remove-standard-advanced] remove standard when API groups are updated
            if (/vanuatu|svg_(standard|financial)/.test(a.group)) {
                return /svg$/.test(b.group) ? 1 : -1;
            }
            return 1;
        });
    }

    get demo_mt5() {
        return this.sorted_mt5_list.filter(this.isDemo);
    }

    get remaining_demo_mt5() {
        const existing_demo_mt5_groups = Object.keys(this.demo_mt5).map(account => this.demo_mt5[account].group);
        return this.getRemainingAccounts(existing_demo_mt5_groups);
    }

    get real_mt5() {
        return this.sorted_mt5_list.filter(this.isReal);
    }

    get remaining_real_mt5() {
        const existing_real_mt5_groups = Object.keys(this.real_mt5).map(account => this.real_mt5[account].group);
        return this.getRemainingAccounts(existing_real_mt5_groups);
    }

    // SVG clients can't upgrade.
    get remaining_real_accounts() {
        return this.can_open_multi ? [] : this.props.upgradeable_landing_companies;
    }

    get has_set_currency() {
        return this.props.account_list.filter(account => !account.is_virtual).some(account => account.title !== 'Real');
    }

    get can_upgrade() {
        return !!(this.props.is_virtual && this.props.can_upgrade_to);
    }

    get can_open_multi() {
        if (this.props.is_eu) return false;
        if (this.props.available_crypto_currencies.length < 1 && !this.props.has_fiat) return true;
        return !this.props.is_virtual;
    }

    get total_demo_assets() {
        const vrtc_loginid = this.props.account_list.find(account => account.is_virtual).loginid;
        const vrtc_balance = this.props.accounts[vrtc_loginid] ? this.props.accounts[vrtc_loginid].balance : 0;
        const mt5_demo_total = this.props.mt5_login_list
            .filter(account => /^demo/.test(account.group))
            .reduce(
                (total, account) => {
                    total.balance += account.balance;
                    return total;
                },
                { balance: 0 }
            );
        return Array.isArray(this.props.mt5_login_list) ? mt5_demo_total.balance + vrtc_balance : vrtc_balance;
    }

    get total_real_assets() {
        return this.props.obj_total_balance.amount_real + this.props.obj_total_balance.amount_mt5;
    }

    render() {
        if (!this.props.is_logged_in) return false;

        const total_assets_message_demo = this.props.is_mt5_allowed
            ? localize('Total assets in your Deriv and DMT5 demo accounts.')
            : localize('Total assets in your Deriv demo accounts.');

        const total_assets_message_real = this.props.is_mt5_allowed
            ? localize('Total assets in your Deriv and DMT5 real accounts.')
            : localize('Total assets in your Deriv real accounts.');

        const total_assets_message = this.is_real_account_tab ? total_assets_message_real : total_assets_message_demo;

        const demo_accounts = (
            <div className='acc-switcher__list-wrapper'>
                <AccountWrapper
                    header={localize('Deriv Accounts')}
                    is_visible={this.state.is_demo_deriv_visible}
                    toggleVisibility={() => {
                        this.toggleVisibility('demo_deriv');
                    }}
                >
                    <div className='acc-switcher__accounts'>
                        {this.sorted_account_list
                            .filter(account => account.is_virtual)
                            .map(account => (
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
                                    onClickAccount={
                                        account.is_disabled ? undefined : this.doSwitch.bind(this, account.loginid)
                                    }
                                    selected_loginid={this.props.account_loginid}
                                />
                            ))}
                    </div>
                </AccountWrapper>
                {this.props.is_mt5_allowed && (
                    <React.Fragment>
                        <div className='acc-switcher__separator acc-switcher__separator--no-padding' />
                        <AccountWrapper
                            header={localize('DMT5 Accounts')}
                            is_visible={this.state.is_demo_dmt5_visible}
                            toggleVisibility={() => {
                                this.toggleVisibility('demo_dmt5');
                            }}
                        >
                            {this.props.is_loading_mt5 ? (
                                <div className='acc-switcher__accounts--is-loading'>
                                    <AccountsItemLoader speed={3} />
                                </div>
                            ) : (
                                <React.Fragment>
                                    {!!this.demo_mt5.length && (
                                        <div className='acc-switcher__accounts'>
                                            {this.demo_mt5.map(account => (
                                                <AccountList
                                                    key={account.login}
                                                    account_type={account.group}
                                                    balance={account.balance}
                                                    currency={account.currency}
                                                    currency_icon={`IcMt5-${getMT5Account(account.group)}`}
                                                    has_balance={'balance' in account}
                                                    loginid={account.display_login}
                                                    onClickAccount={this.redirectToMt5Demo}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {this.remaining_demo_mt5.map(account => (
                                        <div key={account.title} className='acc-switcher__new-account'>
                                            <Icon icon={`IcMt5-${account.icon}`} size={24} />
                                            <span className='acc-switcher__new-account-text'>{account.title}</span>
                                            <Button
                                                onClick={() => this.openMt5DemoAccount(account.type)}
                                                className='acc-switcher__new-account-btn'
                                                secondary
                                                small
                                            >
                                                {localize('Add')}
                                            </Button>
                                        </div>
                                    ))}
                                </React.Fragment>
                            )}
                        </AccountWrapper>
                    </React.Fragment>
                )}
            </div>
        );

        const real_accounts = (
            <div className='acc-switcher__list-wrapper' onMouseEnter={this.onListEnter} onMouseLeave={this.onListLeave}>
                <React.Fragment>
                    <AccountWrapper
                        header={localize('Deriv Accounts')}
                        is_visible={this.state.is_real_deriv_visible}
                        toggleVisibility={() => {
                            this.toggleVisibility('real_deriv');
                        }}
                    >
                        <div className='acc-switcher__accounts'>
                            {this.sorted_account_list
                                .filter(account => !account.is_virtual)
                                .map(account => {
                                    return (
                                        <AccountList
                                            key={account.loginid}
                                            balance={this.props.accounts[account.loginid].balance}
                                            currency={this.props.accounts[account.loginid].currency}
                                            currency_icon={`IcCurrency-${account.icon}`}
                                            display_type={'currency'}
                                            has_balance={'balance' in this.props.accounts[account.loginid]}
                                            is_disabled={account.is_disabled}
                                            is_virtual={account.is_virtual}
                                            is_eu={this.props.is_eu}
                                            loginid={account.loginid}
                                            onClickAccount={
                                                account.is_disabled
                                                    ? undefined
                                                    : this.doSwitch.bind(this, account.loginid)
                                            }
                                            selected_loginid={this.props.account_loginid}
                                        />
                                    );
                                })}
                        </div>
                        {this.remaining_real_accounts.map((account, index) => (
                            <div key={index} className='acc-switcher__new-account'>
                                <Icon icon='IcDeriv' size={24} />
                                <span className='acc-switcher__new-account-text'>{getAccountTitle(account)}</span>
                                <Button
                                    onClick={() => this.onClickUpgrade(account)}
                                    className='acc-switcher__new-account-btn'
                                    secondary
                                    small
                                >
                                    {localize('Add')}
                                </Button>
                            </div>
                        ))}
                        {!this.can_upgrade && this.can_open_multi && (
                            <Button
                                className='acc-switcher__btn'
                                secondary
                                onClick={
                                    this.has_set_currency
                                        ? () => this.props.openRealAccountSignup('manage')
                                        : this.setAccountCurrency
                                }
                            >
                                {this.props.has_fiat && this.props.available_crypto_currencies?.length === 0
                                    ? localize('Manage account')
                                    : localize('Add or manage account')}
                            </Button>
                        )}
                    </AccountWrapper>
                </React.Fragment>
                {this.props.is_mt5_allowed && (
                    <React.Fragment>
                        <div className='acc-switcher__separator acc-switcher__separator--no-padding' />
                        <AccountWrapper
                            header={localize('DMT5 Accounts')}
                            is_visible={this.state.is_real_dmt5_visible}
                            toggleVisibility={() => {
                                this.toggleVisibility('real_dmt5');
                            }}
                        >
                            {this.props.is_loading_mt5 ? (
                                <div className='acc-switcher__accounts--is-loading'>
                                    <AccountsItemLoader speed={3} />
                                </div>
                            ) : (
                                <React.Fragment>
                                    {!!this.real_mt5.length && (
                                        <div className='acc-switcher__accounts'>
                                            {this.real_mt5.map(account => (
                                                <AccountList
                                                    key={account.login}
                                                    account_type={account.group}
                                                    balance={account.balance}
                                                    currency={account.currency}
                                                    currency_icon={`IcMt5-${getMT5Account(account.group)}`}
                                                    has_balance={'balance' in account}
                                                    loginid={account.display_login}
                                                    onClickAccount={this.redirectToMt5Real}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {this.remaining_real_mt5.map(account => (
                                        <div
                                            key={account.title}
                                            className={classNames('acc-switcher__new-account', {
                                                'acc-switcher__new-account--disabled': this.props.mt5_login_list_error,
                                            })}
                                        >
                                            <Icon icon={`IcMt5-${account.icon}`} size={24} />
                                            <span className='acc-switcher__new-account-text'>{account.title}</span>
                                            <Button
                                                onClick={() => this.openMt5RealAccount(account.type)}
                                                className='acc-switcher__new-account-btn'
                                                secondary
                                                small
                                                is_disabled={
                                                    ((!this.props.is_eu_enabled || !this.props.is_eu) && // TODO [deriv-eu] remove is_eu_enabled check once EU is ready for production
                                                        !this.props.has_any_real_account) ||
                                                    (account.type === 'financial_stp' &&
                                                        this.props.is_pending_authentication) ||
                                                    !!this.props.mt5_login_list_error
                                                }
                                            >
                                                {localize('Add')}
                                            </Button>
                                        </div>
                                    ))}
                                </React.Fragment>
                            )}
                        </AccountWrapper>
                    </React.Fragment>
                )}
            </div>
        );

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
                        <DesktopWrapper>
                            <ThemedScrollbars height='354px'>{real_accounts}</ThemedScrollbars>
                        </DesktopWrapper>
                        <MobileWrapper>
                            <Div100vhContainer className='acc-switcher__list-container' max_autoheight_offset='234px'>
                                {real_accounts}
                            </Div100vhContainer>
                        </MobileWrapper>
                    </div>
                    <div label={localize('Demo')}>
                        <DesktopWrapper>
                            <ThemedScrollbars height='354px'>{demo_accounts}</ThemedScrollbars>
                        </DesktopWrapper>
                        <MobileWrapper>
                            <Div100vhContainer className='acc-switcher__list-container' max_autoheight_offset='234px'>
                                {demo_accounts}
                            </Div100vhContainer>
                        </MobileWrapper>
                    </div>
                </Tabs>
                <div
                    className={classNames('acc-switcher__separator', {
                        'acc-switcher__separator--auto-margin': this.props.is_mobile,
                    })}
                />
                <div className='acc-switcher__total'>
                    <span>
                        <Localize i18n_default_text='Total assets' />
                    </span>
                    <span className='acc-switcher__balance'>
                        <Money
                            currency={this.is_real_account_tab ? this.props.obj_total_balance.currency : 'USD'}
                            amount={formatMoney(
                                this.is_real_account_tab ? this.props.obj_total_balance.currency : 'USD',
                                this.is_real_account_tab ? this.total_real_assets : this.total_demo_assets,
                                true
                            )}
                            show_currency
                            should_format={false}
                        />
                    </span>
                </div>
                <div className='acc-switcher__total-subtitle'>
                    <span>{total_assets_message}</span>
                </div>
                <div className='acc-switcher__separator' />
                <div className='acc-switcher__footer'>
                    {this.props.is_uk && this.props.has_any_real_account && (
                        <Button
                            className='acc-switcher__compare'
                            type='button'
                            has_effect
                            onClick={this.showAccountTypesModal}
                            text={localize('Compare')}
                            secondary
                        />
                    )}
                    <div id='dt_logout_button' className='acc-switcher__logout'>
                        <span className='acc-switcher__logout-text' onClick={this.handleLogout}>
                            {localize('Log out')}
                        </span>
                        <Icon
                            icon='IcLogout'
                            className='acc-switcher__logout-icon drawer__icon'
                            onClick={this.handleLogout}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

AccountSwitcher.propTypes = {
    available_crypto_currencies: PropTypes.array,
    account_list: PropTypes.array,
    account_loginid: PropTypes.string,
    accounts: PropTypes.object,
    can_change_fiat_currency: PropTypes.bool,
    can_upgrade_to: PropTypes.string,
    has_fiat: PropTypes.bool,
    has_any_real_account: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_eu_enabled: PropTypes.bool, // TODO [deriv-eu] remove is_eu_enabled check once EU is ready for production
    is_loading_mt5: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_pending_authentication: PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_uk: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_visible: PropTypes.bool,
    logoutClient: PropTypes.func,
    mt5_login_list: PropTypes.array,
    obj_total_balance: PropTypes.object,
    openRealAccountSignup: PropTypes.func,
    switchAccount: PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
    toggleAccountTypesModal: PropTypes.func,
    togglePositionsDrawer: PropTypes.func,
    toggleSetCurrencyModal: PropTypes.func,
    updateMt5LoginList: PropTypes.func,
};

const account_switcher = withRouter(
    connect(({ client, common, ui }) => ({
        available_crypto_currencies: client.available_crypto_currencies,
        account_loginid: client.loginid,
        accounts: client.accounts,
        can_change_fiat_currency: client.can_change_fiat_currency,
        account_list: client.account_list,
        can_upgrade_to: client.can_upgrade_to,
        is_eu: client.is_eu,
        is_eu_enabled: ui.is_eu_enabled, // TODO [deriv-eu] remove is_eu_enabled check once EU is ready for production
        is_loading_mt5: client.is_populating_mt5_account_list,
        is_logged_in: client.is_logged_in,
        is_mt5_allowed: client.is_mt5_allowed,
        is_pending_authentication: client.is_pending_authentication,
        is_uk: client.is_uk,
        is_virtual: client.is_virtual,
        has_fiat: client.has_fiat,
        has_any_real_account: client.has_any_real_account,
        mt5_login_list: client.mt5_login_list,
        mt5_login_list_error: client.mt5_login_list_error,
        obj_total_balance: client.obj_total_balance,
        switchAccount: client.switchAccount,
        has_malta_account: client.has_malta_account,
        has_maltainvest_account: client.has_maltainvest_account,
        openAccountNeededModal: ui.openAccountNeededModal,
        logoutClient: client.logout,
        landing_companies: client.landing_companies,
        upgradeable_landing_companies: client.upgradeable_landing_companies,
        updateMt5LoginList: client.updateMt5LoginList,
        routeBackInApp: common.routeBackInApp,
        standpoint: client.standpoint,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        openRealAccountSignup: ui.openRealAccountSignup,
        toggleAccountsDialog: ui.toggleAccountsDialog,
        toggleAccountTypesModal: ui.toggleAccountTypesModal,
        togglePositionsDrawer: ui.togglePositionsDrawer,
        toggleSetCurrencyModal: ui.toggleSetCurrencyModal,
    }))(AccountSwitcher)
);

export { account_switcher as AccountSwitcher };
