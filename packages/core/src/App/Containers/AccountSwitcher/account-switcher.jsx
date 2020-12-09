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
    Text,
    useOnClickOutside,
} from '@deriv/components';
import { urlFor, routes, isCryptocurrency, formatMoney, getMT5Account } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { getAccountTitle } from 'App/Containers/RealAccountSignup/helpers/constants';
import { connect } from 'Stores/connect';
import { AccountsItemLoader } from 'App/Components/Layout/Header/Components/Preloader';
import AccountList from './account-switcher-account-list.jsx';
import AccountWrapper from './account-switcher-account-wrapper.jsx';

const AccountSwitcher = props => {
    const [active_tab_index, setActiveTabIndex] = React.useState(
        !props.is_virtual || props.should_show_real_accounts_list ? 0 : 1
    );
    const [is_demo_deriv_visible, setDemoDerivVisible] = React.useState(true);
    const [is_demo_dmt5_visible, setDemoDmt5Visible] = React.useState(true);
    const [is_real_deriv_visible, setRealDerivVisible] = React.useState(true);
    const [is_real_dmt5_visible, setRealDmt5Visible] = React.useState(true);

    const wrapper_ref = React.useRef();

    const toggleVisibility = section => {
        switch (section) {
            case 'demo_deriv':
                return setDemoDerivVisible(!is_demo_deriv_visible);
            case 'demo_dmt5':
                return setDemoDmt5Visible(!is_demo_dmt5_visible);
            case 'real_deriv':
                return setRealDerivVisible(!is_real_deriv_visible);
            case 'real_dmt5':
                return setRealDmt5Visible(!is_real_dmt5_visible);
            default:
                return false;
        }
    };

    const handleLogout = () => {
        closeAccountsDialog();
        if (props.is_positions_drawer_on) {
            props.togglePositionsDrawer(); // TODO: hide drawer inside logout, once it is a mobx action
        }
        props.logoutClient().then(() => {
            props.routeBackInApp(props.history);
        });
    };

    const closeAccountsDialog = () => {
        props.toggleAccountsDialog(false);
    };

    const validateClickOutside = event => props.is_visible && !event.target.classList.contains('acc-info');

    useOnClickOutside(wrapper_ref, closeAccountsDialog, validateClickOutside);

    const redirectToMt5 = account_type => {
        closeAccountsDialog();
        props.history.push(`${routes.mt5}#${account_type}`);
    };

    const openMt5RealAccount = account_type => {
        const has_required_account =
            account_type === 'synthetic' ? props.has_malta_account : props.has_maltainvest_account;

        if (props.is_eu && !has_required_account) {
            closeAccountsDialog();
            props.openAccountNeededModal(
                account_type === 'synthetic' ? props.standpoint.gaming_company : props.standpoint.financial_company,
                account_type === 'synthetic' ? localize('Deriv Synthetic') : localize('Deriv Financial'),
                account_type === 'synthetic' ? localize('DMT5 Synthetic') : localize('DMT5 Financial')
            );
        } else {
            sessionStorage.setItem('open_mt5_account_type', `real.${account_type}`);
            redirectToMt5Real();
        }
    };

    const redirectToMt5Real = () => {
        if (!props.is_logged_in || props.is_mt5_allowed) {
            redirectToMt5('real');
        } else {
            window.open(urlFor('user/metatrader', { legacy: true }));
        }
    };

    const openMt5DemoAccount = account_type => {
        sessionStorage.setItem('open_mt5_account_type', `demo.${account_type}`);
        redirectToMt5Demo();
    };

    const redirectToMt5Demo = () => {
        redirectToMt5('demo');
    };

    const setAccountCurrency = () => {
        closeAccountsDialog();
        props.toggleSetCurrencyModal();
    };

    const showAccountTypesModal = () => {
        closeAccountsDialog();
        props.toggleAccountTypesModal(true);
    };

    const isDemo = account => /^demo/.test(account.group);

    const isReal = account => !isDemo(account);

    const getRemainingAccounts = existing_mt5_groups => {
        const byAvailableCompanies = config_item => {
            const [company, type] = config_item.api_key.split('.');
            return !!props.landing_companies?.[company]?.[type];
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

    const doSwitch = async loginid => {
        closeAccountsDialog();
        if (props.account_loginid === loginid) return;
        await props.switchAccount(loginid);
    };

    const resetBalance = async () => {
        closeAccountsDialog();
        props.resetVirtualBalance();
    };

    const isRealAccountTab = () => {
        // Real accounts is always the first tab index based on design
        return active_tab_index === 0;
    };

    const hasRequiredCredentials = () => {
        // for MT5 Real Financial STP, if true, users can instantly create a new account by setting password
        if (!props.account_settings) return false;
        const { citizen, tax_identification_number, tax_residence } = props.account_settings;
        return !!(citizen && tax_identification_number && tax_residence);
    };

    const sortedAccountList = () => {
        // sort accounts as follows:
        // top is fiat, then crypto (each alphabetically by currency), then demo
        return props.account_list.slice().sort((a, b) => {
            const a_currency = props.accounts[a.loginid].currency;
            const b_currency = props.accounts[b.loginid].currency;
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
    };

    const sortedMT5List = () => {
        // for MT5, synthetic, financial, financial stp
        return props.mt5_login_list.slice().sort((a, b) => {
            if (/demo/.test(a.group) && !/demo/.test(b.group)) return 1;
            if (/demo/.test(b.group) && !/demo/.test(a.group)) return -1;
            if (/svg$/.test(a.group)) return -1;
            // TODO: [remove-standard-advanced] remove standard when API groups are updated
            if (/vanuatu|svg_(standard|financial)/.test(a.group)) return /svg$/.test(b.group) ? 1 : -1;
            return 1;
        });
    };

    const demoMT5 = () => {
        return sortedMT5List().filter(isDemo);
    };

    const remainingDemoMT5 = () => {
        const existing_demo_mt5_groups = Object.keys(demoMT5()).map(account => demoMT5()[account].group);
        return getRemainingAccounts(existing_demo_mt5_groups);
    };

    const realMT5 = () => {
        return sortedMT5List().filter(isReal);
    };

    const remainingRealMT5 = () => {
        const existing_real_mt5_groups = Object.keys(realMT5()).map(account => realMT5()[account].group);
        return getRemainingAccounts(existing_real_mt5_groups);
    };

    // SVG clients can't upgrade.
    const remainingRealAccounts = () => {
        return canOpenMulti() ? [] : props.upgradeable_landing_companies;
    };

    const hasSetCurrency = () => {
        return props.account_list.filter(account => !account.is_virtual).some(account => account.title !== 'Real');
    };

    const canUpgrade = () => {
        return !!(props.is_virtual && props.can_upgrade_to);
    };

    const canOpenMulti = () => {
        if (props.is_eu) return false;
        if (props.available_crypto_currencies.length < 1 && !props.has_fiat) return true;
        return !props.is_virtual;
    };

    const totalDemoAssets = () => {
        const vrtc_loginid = props.account_list.find(account => account.is_virtual).loginid;
        const vrtc_balance = props.accounts[vrtc_loginid] ? props.accounts[vrtc_loginid].balance : 0;
        const mt5_demo_total = props.mt5_login_list
            .filter(account => /^demo/.test(account.group))
            .reduce(
                (total, account) => {
                    total.balance += account.balance;
                    return total;
                },
                { balance: 0 }
            );
        return Array.isArray(props.mt5_login_list) ? mt5_demo_total.balance + vrtc_balance : vrtc_balance;
    };

    const totalRealAssets = () => {
        return props.obj_total_balance.amount_real + props.obj_total_balance.amount_mt5;
    };

    if (!props.is_logged_in) return false;

    const total_assets_message_demo = props.is_mt5_allowed
        ? localize('Total assets in your Deriv and DMT5 demo accounts.')
        : localize('Total assets in your Deriv demo accounts.');

    const total_assets_message_real = props.is_mt5_allowed
        ? localize('Total assets in your Deriv and DMT5 real accounts.')
        : localize('Total assets in your Deriv real accounts.');

    const total_assets_message = isRealAccountTab() ? total_assets_message_real : total_assets_message_demo;

    const demo_accounts = (
        <div className='acc-switcher__list-wrapper'>
            <AccountWrapper
                header={localize('Deriv Accounts')}
                is_visible={is_demo_deriv_visible}
                toggleVisibility={() => {
                    toggleVisibility('demo_deriv');
                }}
            >
                <div className='acc-switcher__accounts'>
                    {sortedAccountList()
                        .filter(account => account.is_virtual)
                        .map(account => (
                            <AccountList
                                key={account.loginid}
                                balance={props.accounts[account.loginid].balance}
                                currency={props.accounts[account.loginid].currency}
                                currency_icon={`IcCurrency-${account.icon}`}
                                display_type={'currency'}
                                has_balance={'balance' in props.accounts[account.loginid]}
                                has_reset_balance={props.accounts[props.account_loginid].is_virtual}
                                is_disabled={account.is_disabled}
                                is_virtual={account.is_virtual}
                                loginid={account.loginid}
                                onClickAccount={account.is_disabled ? undefined : () => doSwitch(account.loginid)}
                                onClickResetVirtualBalance={resetBalance}
                                selected_loginid={props.account_loginid}
                            />
                        ))}
                </div>
            </AccountWrapper>
            {props.is_mt5_allowed && (
                <React.Fragment>
                    <div className='acc-switcher__separator acc-switcher__separator--no-padding' />
                    <AccountWrapper
                        header={localize('DMT5 Accounts')}
                        is_visible={is_demo_dmt5_visible}
                        toggleVisibility={() => {
                            toggleVisibility('demo_dmt5');
                        }}
                    >
                        {props.is_loading_mt5 ? (
                            <div className='acc-switcher__accounts--is-loading'>
                                <AccountsItemLoader speed={3} />
                            </div>
                        ) : (
                            <React.Fragment>
                                {!!demoMT5().length && (
                                    <div className='acc-switcher__accounts'>
                                        {demoMT5().map(account => (
                                            <AccountList
                                                key={account.login}
                                                account_type={account.group}
                                                balance={account.balance}
                                                currency={account.currency}
                                                currency_icon={`IcMt5-${getMT5Account(account.group)}`}
                                                has_balance={'balance' in account}
                                                loginid={account.display_login}
                                                onClickAccount={redirectToMt5Demo}
                                            />
                                        ))}
                                    </div>
                                )}
                                {remainingDemoMT5().map(account => (
                                    <div key={account.title} className='acc-switcher__new-account'>
                                        <Icon icon={`IcMt5-${account.icon}`} size={24} />
                                        <Text size='xs' color='general' className='acc-switcher__new-account-text'>
                                            {account.title}
                                        </Text>
                                        <Button
                                            onClick={() => openMt5DemoAccount(account.type)}
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
        <div className='acc-switcher__list-wrapper'>
            <React.Fragment>
                <AccountWrapper
                    header={localize('Deriv Accounts')}
                    is_visible={is_real_deriv_visible}
                    toggleVisibility={() => {
                        toggleVisibility('real_deriv');
                    }}
                >
                    <div className='acc-switcher__accounts'>
                        {sortedAccountList()
                            .filter(account => !account.is_virtual)
                            .map(account => {
                                return (
                                    <AccountList
                                        key={account.loginid}
                                        balance={props.accounts[account.loginid].balance}
                                        currency={props.accounts[account.loginid].currency}
                                        currency_icon={`IcCurrency-${account.icon}`}
                                        display_type={'currency'}
                                        has_balance={'balance' in props.accounts[account.loginid]}
                                        is_disabled={account.is_disabled}
                                        is_virtual={account.is_virtual}
                                        is_eu={props.is_eu}
                                        loginid={account.loginid}
                                        onClickAccount={
                                            account.is_disabled ? undefined : () => doSwitch(account.loginid)
                                        }
                                        selected_loginid={props.account_loginid}
                                    />
                                );
                            })}
                    </div>
                    {remainingRealAccounts().map((account, index) => (
                        <div key={index} className='acc-switcher__new-account'>
                            <Icon icon='IcDeriv' size={24} />
                            <Text size='xs' color='general' className='acc-switcher__new-account-text'>
                                {getAccountTitle(account, {
                                    account_residence: props.client_residence,
                                })}
                            </Text>
                            <Button
                                onClick={() => {
                                    props.openRealAccountSignup(account);
                                }}
                                className='acc-switcher__new-account-btn'
                                secondary
                                small
                            >
                                {localize('Add')}
                            </Button>
                        </div>
                    ))}
                    {!canUpgrade() && canOpenMulti() && (
                        <Button
                            className='acc-switcher__btn'
                            secondary
                            onClick={
                                hasSetCurrency() ? () => props.openRealAccountSignup('manage') : setAccountCurrency
                            }
                        >
                            {props.has_fiat && props.available_crypto_currencies?.length === 0
                                ? localize('Manage account')
                                : localize('Add or manage account')}
                        </Button>
                    )}
                </AccountWrapper>
            </React.Fragment>
            {props.is_mt5_allowed && (
                <React.Fragment>
                    <div className='acc-switcher__separator acc-switcher__separator--no-padding' />
                    <AccountWrapper
                        header={localize('DMT5 Accounts')}
                        is_visible={is_real_dmt5_visible}
                        toggleVisibility={() => {
                            toggleVisibility('real_dmt5');
                        }}
                    >
                        {props.is_loading_mt5 ? (
                            <div className='acc-switcher__accounts--is-loading'>
                                <AccountsItemLoader speed={3} />
                            </div>
                        ) : (
                            <React.Fragment>
                                {!!realMT5().length && (
                                    <div className='acc-switcher__accounts'>
                                        {realMT5().map(account => (
                                            <AccountList
                                                key={account.login}
                                                account_type={account.group}
                                                balance={account.balance}
                                                currency={account.currency}
                                                currency_icon={`IcMt5-${getMT5Account(account.group)}`}
                                                has_balance={'balance' in account}
                                                loginid={account.display_login}
                                                onClickAccount={redirectToMt5Real}
                                            />
                                        ))}
                                    </div>
                                )}
                                {remainingRealMT5().map(account => (
                                    <div
                                        key={account.title}
                                        className={classNames('acc-switcher__new-account', {
                                            'acc-switcher__new-account--disabled': props.mt5_login_list_error,
                                        })}
                                    >
                                        <Icon icon={`IcMt5-${account.icon}`} size={24} />
                                        <Text size='xs' color='general' className='acc-switcher__new-account-text'>
                                            {account.title}
                                        </Text>
                                        <Button
                                            onClick={() => openMt5RealAccount(account.type)}
                                            className='acc-switcher__new-account-btn'
                                            secondary
                                            small
                                            is_disabled={
                                                (!props.is_eu && !props.has_any_real_account) ||
                                                (account.type === 'financial_stp' &&
                                                    (props.is_pending_authentication || hasRequiredCredentials())) ||
                                                !!props.mt5_login_list_error
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
        <div className='acc-switcher__list' ref={wrapper_ref}>
            <Tabs
                active_index={active_tab_index}
                className='acc-switcher__list-tabs'
                onTabItemClick={index => setActiveTabIndex(index)}
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
                    'acc-switcher__separator--auto-margin': props.is_mobile,
                })}
            />
            <div className='acc-switcher__total'>
                <Text line_height='s' size='xs' weight='bold' color='prominent'>
                    <Localize i18n_default_text='Total assets' />
                </Text>
                <Text size='xs' color='prominent' className='acc-switcher__balance'>
                    <Money
                        currency={isRealAccountTab() ? props.obj_total_balance.currency : 'USD'}
                        amount={formatMoney(
                            isRealAccountTab() ? props.obj_total_balance.currency : 'USD',
                            isRealAccountTab() ? totalRealAssets() : totalDemoAssets(),
                            true
                        )}
                        show_currency
                        should_format={false}
                    />
                </Text>
            </div>
            <Text color='less-prominent' line_height='xs' size='xxxs' className='acc-switcher__total-subtitle'>
                {total_assets_message}
            </Text>
            <div className='acc-switcher__separator' />
            <div className='acc-switcher__footer'>
                {props.is_uk && props.has_any_real_account && (
                    <Button
                        className='acc-switcher__compare'
                        type='button'
                        has_effect
                        onClick={showAccountTypesModal}
                        text={localize('Compare')}
                        secondary
                    />
                )}
                <div id='dt_logout_button' className='acc-switcher__logout' onClick={handleLogout}>
                    <Text color='prominent' size='xs' align='left' className='acc-switcher__logout-text'>
                        {localize('Log out')}
                    </Text>
                    <Icon icon='IcLogout' className='acc-switcher__logout-icon drawer__icon' onClick={handleLogout} />
                </div>
            </div>
        </div>
    );
};

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
    resetVirtualBalance: PropTypes.func,
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
        account_settings: client.account_settings,
        can_change_fiat_currency: client.can_change_fiat_currency,
        account_list: client.account_list,
        can_upgrade_to: client.can_upgrade_to,
        client_residence: client.residence,
        is_eu: client.is_eu,
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
        resetVirtualBalance: client.resetVirtualBalance,
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
        should_show_real_accounts_list: ui.should_show_real_accounts_list,
        toggleShouldShowRealAccountsList: ui.toggleShouldShowRealAccountsList,
    }))(AccountSwitcher)
);

export { account_switcher as AccountSwitcher };
