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
import { routes, formatMoney, ContentFlag } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { getAccountTitle } from 'App/Containers/RealAccountSignup/helpers/constants';
import { connect } from 'Stores/connect';
import AccountList from './account-switcher-account-list.jsx';
import AccountWrapper from './account-switcher-account-wrapper.jsx';
import { getSortedAccountList, getSortedCFDList, isDemo } from './helpers';
import { BinaryLink } from 'App/Components/Routes';

const AccountSwitcher = ({
    available_crypto_currencies,
    account_list,
    account_loginid,
    accounts,
    account_type,
    client_residence,
    country_standpoint,
    has_active_real_account,
    has_any_real_account,
    has_fiat,
    history,
    is_dark_mode_on,
    is_eu,
    is_low_risk,
    is_high_risk,
    is_logged_in,
    is_mobile,
    is_positions_drawer_on,
    is_virtual,
    is_visible,
    landing_company_shortcode,
    logoutClient,
    mt5_login_list,
    obj_total_balance,
    openRealAccountSignup,
    routeBackInApp,
    should_show_real_accounts_list,
    show_eu_related_content,
    switchAccount,
    resetVirtualBalance,
    toggleAccountsDialog,
    togglePositionsDrawer,
    toggleSetCurrencyModal,
    upgradeable_landing_companies,
    real_account_creation_unlock_date,
    setShouldShowCooldownModal,
    content_flag,
    virtual_account_loginid,
    setTogglePlatformType,
}) => {
    const [active_tab_index, setActiveTabIndex] = React.useState(!is_virtual || should_show_real_accounts_list ? 0 : 1);
    const [is_deriv_demo_visible, setDerivDemoVisible] = React.useState(true);
    const [is_deriv_real_visible, setDerivRealVisible] = React.useState(true);
    const [is_non_eu_regulator_visible, setNonEuRegulatorVisible] = React.useState(true);
    const [is_eu_regulator_visible, setEuRegulatorVisible] = React.useState(true);

    const wrapper_ref = React.useRef();
    const scroll_ref = React.useRef(null);

    const account_total_balance_currency = obj_total_balance.currency;

    const vrtc_loginid = account_list.find(account => account.is_virtual)?.loginid;
    const vrtc_currency = accounts[vrtc_loginid] ? accounts[vrtc_loginid].currency : 'USD';

    const toggleVisibility = section => {
        switch (section) {
            case 'demo_deriv':
                return setDerivDemoVisible(!is_deriv_demo_visible);
            case 'real_deriv':
                return setDerivRealVisible(!is_deriv_real_visible);
            case 'non-eu-regulator':
                return setNonEuRegulatorVisible(!is_non_eu_regulator_visible);
            case 'eu-regulator':
                return setEuRegulatorVisible(!is_eu_regulator_visible);
            default:
                return false;
        }
    };

    const handleLogout = async () => {
        closeAccountsDialog();
        if (is_positions_drawer_on) {
            togglePositionsDrawer(); // TODO: hide drawer inside logout, once it is a mobx action
        }
        routeBackInApp(history);
        await logoutClient();
    };

    const closeAccountsDialog = () => {
        toggleAccountsDialog(false);
    };

    const validateClickOutside = event => is_visible && !event.target.classList.contains('acc-info');

    useOnClickOutside(wrapper_ref, closeAccountsDialog, validateClickOutside);

    const setAccountCurrency = () => {
        closeAccountsDialog();
        toggleSetCurrencyModal();
    };

    const doSwitch = async loginid => {
        closeAccountsDialog();
        if (account_loginid === loginid) return;
        await switchAccount(loginid);
    };

    const resetBalance = async () => {
        closeAccountsDialog();
        resetVirtualBalance();
    };

    // Real accounts is always the first tab index based on design
    const isRealAccountTab = active_tab_index === 0;
    const isDemoAccountTab = active_tab_index === 1;

    const getRealMT5 = () => {
        const low_risk_non_eu = content_flag === ContentFlag.LOW_RISK_CR_NON_EU;
        if (low_risk_non_eu) {
            return getSortedCFDList(mt5_login_list).filter(
                account => !isDemo(account) && account.landing_company_short !== 'maltainvest'
            );
        }
        return getSortedCFDList(mt5_login_list).filter(account => !isDemo(account));
    };

    const canOpenMulti = () => {
        if (available_crypto_currencies.length < 1 && !has_fiat) return true;
        return !is_virtual;
    };

    const is_regulated_able_to_change_currency =
        show_eu_related_content &&
        (landing_company_shortcode === 'malta' ||
            (landing_company_shortcode === 'iom' && upgradeable_landing_companies.length !== 0));

    // SVG clients can't upgrade.
    const getRemainingRealAccounts = () => {
        if (
            show_eu_related_content ||
            is_virtual ||
            !canOpenMulti() ||
            is_regulated_able_to_change_currency ||
            is_low_risk
        ) {
            return upgradeable_landing_companies;
        }
        return [];
    };

    const hasSetCurrency = () => {
        return account_list.filter(account => !account.is_virtual).some(account => account.title !== 'Real');
    };

    const getTotalDemoAssets = () => {
        const vrtc_balance = accounts[vrtc_loginid] ? accounts[vrtc_loginid].balance : 0;

        return vrtc_balance;
    };

    const getTotalRealAssets = () => {
        const traders_hub_total = obj_total_balance.amount_real;
        return traders_hub_total;
    };

    if (!is_logged_in) return false;

    const canResetBalance = account => {
        const account_init_balance = 10000;
        return account.is_virtual && account.balance !== account_init_balance;
    };

    const checkMultipleSvgAcc = () => {
        const all_svg_acc = [];
        getRealMT5().map(acc => {
            if (acc.landing_company_short === 'svg' && acc.market_type === 'synthetic') {
                if (all_svg_acc.length) {
                    all_svg_acc.forEach(svg_acc => {
                        if (svg_acc.server !== acc.server) all_svg_acc.push(acc);
                        return all_svg_acc;
                    });
                } else {
                    all_svg_acc.push(acc);
                }
            }
        });
        return all_svg_acc.length > 1;
    };

    const have_more_accounts = type =>
        getSortedAccountList(account_list, accounts).filter(
            account => !account.is_virtual && account.loginid.startsWith(type)
        ).length > 1;

    // all: 1 in mt5_status response means that server is suspended
    const has_cr_account = account_list.find(acc => acc.loginid?.startsWith('CR'))?.loginid;

    const demo_account = (
        <div className='acc-switcher__list-wrapper'>
            {vrtc_loginid && (
                <AccountWrapper
                    header={localize('Deriv account')}
                    is_visible={is_deriv_demo_visible}
                    toggleVisibility={() => {
                        toggleVisibility('demo_deriv');
                    }}
                >
                    <div className='acc-switcher__accounts'>
                        {getSortedAccountList(account_list, accounts)
                            .filter(account => account.is_virtual)
                            .map(account => (
                                <AccountList
                                    is_dark_mode_on={is_dark_mode_on}
                                    key={account.loginid}
                                    balance={accounts[account.loginid].balance}
                                    currency={accounts[account.loginid].currency}
                                    currency_icon={`IcCurrency-${account.icon}`}
                                    country_standpoint={country_standpoint}
                                    display_type={'currency'}
                                    has_balance={'balance' in accounts[account.loginid]}
                                    has_reset_balance={canResetBalance(accounts[account_loginid])}
                                    is_disabled={account.is_disabled}
                                    is_virtual={account.is_virtual}
                                    loginid={account.loginid}
                                    redirectAccount={account.is_disabled ? undefined : () => doSwitch(account.loginid)}
                                    onClickResetVirtualBalance={resetBalance}
                                    selected_loginid={account_loginid}
                                />
                            ))}
                    </div>
                </AccountWrapper>
            )}
        </div>
    );

    const real_accounts = (
        <div ref={scroll_ref} className='acc-switcher__list-wrapper'>
            <React.Fragment>
                {!is_eu || is_low_risk ? (
                    <React.Fragment>
                        <AccountWrapper
                            className='acc-switcher__title'
                            header={
                                is_low_risk
                                    ? localize(`Non-EU Deriv ${have_more_accounts('CR') ? 'accounts' : 'account'}`)
                                    : localize(`Deriv ${have_more_accounts('CR') ? 'accounts' : 'account'}`)
                            }
                            is_visible={is_non_eu_regulator_visible}
                            toggleVisibility={() => {
                                toggleVisibility('real_deriv');
                            }}
                        >
                            <div className='acc-switcher__accounts'>
                                {getSortedAccountList(account_list, accounts)
                                    .filter(account => !account.is_virtual && account.loginid.startsWith('CR'))
                                    .map(account => {
                                        return (
                                            <AccountList
                                                account_type={account_type}
                                                is_dark_mode_on={is_dark_mode_on}
                                                key={account.loginid}
                                                balance={accounts[account.loginid].balance}
                                                currency={accounts[account.loginid].currency}
                                                currency_icon={`IcCurrency-${account.icon}`}
                                                country_standpoint={country_standpoint}
                                                display_type={'currency'}
                                                has_balance={'balance' in accounts[account.loginid]}
                                                is_disabled={account.is_disabled}
                                                is_virtual={account.is_virtual}
                                                is_eu={is_eu}
                                                loginid={account.loginid}
                                                redirectAccount={
                                                    account.is_disabled ? undefined : () => doSwitch(account.loginid)
                                                }
                                                selected_loginid={account_loginid}
                                                should_show_server_name={checkMultipleSvgAcc()}
                                            />
                                        );
                                    })}
                            </div>
                            {!has_cr_account &&
                                getRemainingRealAccounts()
                                    .filter(account => account === 'svg')
                                    .map((account, index) => (
                                        <div key={index} className='acc-switcher__new-account'>
                                            <Icon icon='IcDeriv' size={24} />
                                            <Text size='xs' color='general' className='acc-switcher__new-account-text'>
                                                {getAccountTitle(
                                                    account,
                                                    { account_residence: client_residence },
                                                    country_standpoint
                                                )}
                                            </Text>
                                            <Button
                                                id='dt_core_account-switcher_add-new-account'
                                                onClick={() => {
                                                    if (real_account_creation_unlock_date) {
                                                        closeAccountsDialog();
                                                        setShouldShowCooldownModal(true);
                                                    } else openRealAccountSignup(account);
                                                }}
                                                className='acc-switcher__new-account-btn'
                                                secondary
                                                small
                                            >
                                                {localize('Add')}
                                            </Button>
                                        </div>
                                    ))}
                        </AccountWrapper>
                        <div className='acc-switcher__separator' />
                    </React.Fragment>
                ) : null}
                {!is_high_risk || is_eu ? (
                    <AccountWrapper
                        header={
                            is_low_risk
                                ? localize(`EU Deriv ${have_more_accounts('MF') ? 'accounts' : 'account'}`)
                                : localize(`Deriv ${have_more_accounts('MF') ? 'accounts' : 'account'}`)
                        }
                        is_visible={is_eu_regulator_visible}
                        toggleVisibility={() => {
                            toggleVisibility('real_deriv');
                        }}
                    >
                        <div className='acc-switcher__accounts'>
                            {getSortedAccountList(account_list, accounts)
                                .filter(account => !account.is_virtual && account.loginid.startsWith('MF'))
                                .map(account => {
                                    return (
                                        <AccountList
                                            account_type={account_type}
                                            is_dark_mode_on={is_dark_mode_on}
                                            key={account.loginid}
                                            balance={accounts[account.loginid].balance}
                                            currency={accounts[account.loginid].currency}
                                            currency_icon={`IcCurrency-${account.icon}`}
                                            country_standpoint={country_standpoint}
                                            display_type={'currency'}
                                            has_balance={'balance' in accounts[account.loginid]}
                                            is_disabled={account.is_disabled}
                                            is_virtual={account.is_virtual}
                                            is_eu={is_eu}
                                            loginid={account.loginid}
                                            redirectAccount={
                                                account.is_disabled ? undefined : () => doSwitch(account.loginid)
                                            }
                                            selected_loginid={account_loginid}
                                            should_show_server_name={checkMultipleSvgAcc()}
                                        />
                                    );
                                })}
                        </div>
                        {getRemainingRealAccounts()
                            .filter(account => account === 'maltainvest')
                            .map((account, index) => {
                                return (
                                    <div key={index} className='acc-switcher__new-account'>
                                        <Icon icon='IcDeriv' size={24} />
                                        <Text size='xs' color='general' className='acc-switcher__new-account-text'>
                                            {getAccountTitle(
                                                account,
                                                { account_residence: client_residence },
                                                country_standpoint
                                            )}
                                        </Text>
                                        <Button
                                            id='dt_core_account-switcher_add-new-account'
                                            onClick={() => {
                                                if (real_account_creation_unlock_date) {
                                                    closeAccountsDialog();
                                                    setShouldShowCooldownModal(true);
                                                } else {
                                                    openRealAccountSignup(account);
                                                }
                                            }}
                                            className='acc-switcher__new-account-btn'
                                            secondary
                                            small
                                        >
                                            {localize('Add')}
                                        </Button>
                                    </div>
                                );
                            })}
                    </AccountWrapper>
                ) : null}
            </React.Fragment>
        </div>
    );

    const first_real_login_id = account_list?.find(account => /^(CR|MF)/.test(account.loginid))?.loginid;

    const TradersHubRedirect = () => {
        const TradersHubLink = () => {
            const handleRedirect = async () => {
                if (!is_virtual && isDemoAccountTab) {
                    await switchAccount(virtual_account_loginid);
                } else if (is_virtual && isRealAccountTab) {
                    await switchAccount(first_real_login_id);
                }
                toggleAccountsDialog(false);
                history.push(routes.traders_hub);
                setTogglePlatformType('cfd');
            };

            return (
                <React.Fragment>
                    <div className='acc-switcher__traders-hub'>
                        <BinaryLink onClick={handleRedirect} className='acc-switcher__traders-hub--link'>
                            <Text size='xs' align='center' className='acc-switcher__traders-hub--text'>
                                <Localize i18n_default_text="Looking for CFD accounts? Go to Trader's hub" />
                            </Text>
                        </BinaryLink>
                    </div>
                    <div className='acc-switcher__separator' />
                </React.Fragment>
            );
        };

        if ((isRealAccountTab && has_any_real_account) || isDemoAccountTab) {
            return <TradersHubLink />;
        }

        return null;
    };

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
                <div label={localize('Real')} id='real_account_tab'>
                    <DesktopWrapper>
                        <ThemedScrollbars height='354px'>{real_accounts}</ThemedScrollbars>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Div100vhContainer className='acc-switcher__list-container' max_autoheight_offset='234px'>
                            {real_accounts}
                        </Div100vhContainer>
                    </MobileWrapper>
                </div>
                <div label={localize('Demo')} id='dt_core_account-switcher_demo-tab'>
                    <DesktopWrapper>
                        <ThemedScrollbars height='354px'>{demo_account}</ThemedScrollbars>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Div100vhContainer className='acc-switcher__list-container' max_autoheight_offset='234px'>
                            {demo_account}
                        </Div100vhContainer>
                    </MobileWrapper>
                </div>
            </Tabs>
            <div
                className={classNames('acc-switcher__separator', {
                    'acc-switcher__separator--auto-margin': is_mobile,
                })}
            />
            <div className='acc-switcher__total'>
                <Text line_height='s' size='xs' weight='bold' color='prominent'>
                    <Localize i18n_default_text='Total assets' />
                </Text>
                <Text size='xs' color='prominent' className='acc-switcher__balance'>
                    <Money
                        currency={isRealAccountTab ? account_total_balance_currency : vrtc_currency}
                        amount={formatMoney(
                            isRealAccountTab ? account_total_balance_currency : vrtc_currency,
                            isRealAccountTab ? getTotalRealAssets() : getTotalDemoAssets(),
                            true
                        )}
                        show_currency
                        should_format={false}
                    />
                </Text>
            </div>
            <Text color='less-prominent' line_height='xs' size='xxxs' className='acc-switcher__total-subtitle'>
                {localize('Total assets in your Deriv accounts.')}
            </Text>
            <div className='acc-switcher__separator' />

            <TradersHubRedirect />

            <div className='acc-switcher__footer'>
                {isRealAccountTab && has_active_real_account && !is_virtual && (
                    <Button
                        className='acc-switcher__btn--traders_hub'
                        secondary
                        onClick={
                            has_any_real_account && !hasSetCurrency()
                                ? setAccountCurrency
                                : () => openRealAccountSignup('manage')
                        }
                    >
                        {localize('Manage accounts')}
                    </Button>
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
    account_type: PropTypes.string,
    client_residence: PropTypes.string,
    country_standpoint: PropTypes.object,
    has_active_real_account: PropTypes.bool,
    has_any_real_account: PropTypes.bool,
    has_fiat: PropTypes.bool,
    history: PropTypes.object,
    is_dark_mode_on: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_low_risk: PropTypes.bool,
    is_high_risk: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_visible: PropTypes.bool,
    landing_company_shortcode: PropTypes.string,
    logoutClient: PropTypes.func,
    mt5_login_list: PropTypes.array,
    obj_total_balance: PropTypes.object,
    openAccountNeededModal: PropTypes.func,
    openRealAccountSignup: PropTypes.func,
    routeBackInApp: PropTypes.func,
    should_show_real_accounts_list: PropTypes.bool,
    show_eu_related_content: PropTypes.bool,
    switchAccount: PropTypes.func,
    resetVirtualBalance: PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
    togglePositionsDrawer: PropTypes.func,
    toggleSetCurrencyModal: PropTypes.func,
    upgradeable_landing_companies: PropTypes.array,
    real_account_creation_unlock_date: PropTypes.number,
    setShouldShowCooldownModal: PropTypes.func,
    content_flag: PropTypes.string,
    virtual_account_loginid: PropTypes.string,
    setTogglePlatformType: PropTypes.func,
};

const account_switcher = withRouter(
    connect(({ client, common, ui, traders_hub }) => ({
        available_crypto_currencies: client.available_crypto_currencies,
        account_loginid: client.loginid,
        accounts: client.accounts,
        account_type: client.account_type,
        account_list: client.account_list,
        client_residence: client.residence,
        country_standpoint: client.country_standpoint,
        is_dark_mode_on: ui.is_dark_mode_on,
        is_eu: client.is_eu,
        is_low_risk: client.is_low_risk,
        is_high_risk: client.is_high_risk,
        is_logged_in: client.is_logged_in,
        is_virtual: client.is_virtual,
        has_fiat: client.has_fiat,
        landing_company_shortcode: client.landing_company_shortcode,
        mt5_login_list: client.mt5_login_list,
        obj_total_balance: client.obj_total_balance,
        switchAccount: client.switchAccount,
        resetVirtualBalance: client.resetVirtualBalance,
        has_active_real_account: client.has_active_real_account,
        logoutClient: client.logout,
        upgradeable_landing_companies: client.upgradeable_landing_companies,
        routeBackInApp: common.routeBackInApp,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        openRealAccountSignup: ui.openRealAccountSignup,
        toggleAccountsDialog: ui.toggleAccountsDialog,
        togglePositionsDrawer: ui.togglePositionsDrawer,
        toggleSetCurrencyModal: ui.toggleSetCurrencyModal,
        should_show_real_accounts_list: ui.should_show_real_accounts_list,
        real_account_creation_unlock_date: client.real_account_creation_unlock_date,
        setShouldShowCooldownModal: ui.setShouldShowCooldownModal,
        show_eu_related_content: traders_hub.show_eu_related_content,
        content_flag: traders_hub.content_flag,
        has_any_real_account: client.has_any_real_account,
        virtual_account_loginid: client.virtual_account_loginid,
        setTogglePlatformType: traders_hub.setTogglePlatformType,
    }))(AccountSwitcher)
);

export { account_switcher as AccountSwitcher };
