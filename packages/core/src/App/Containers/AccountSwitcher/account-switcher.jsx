import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter, useHistory } from 'react-router';
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

const AccountSwitcher = props => {
    const [active_tab_index, setActiveTabIndex] = React.useState(
        !props.is_virtual || props.should_show_real_accounts_list ? 0 : 1
    );
    const [is_deriv_demo_visible, setDerivDemoVisible] = React.useState(true);
    const [is_deriv_real_visible, setDerivRealVisible] = React.useState(true);
    const [is_non_eu_regulator_visible, setNonEuRegulatorVisible] = React.useState(true);
    const [is_eu_regulator_visible, setEuRegulatorVisible] = React.useState(true);

    const wrapper_ref = React.useRef();
    const scroll_ref = React.useRef(null);

    const account_total_balance_currency = props.obj_total_balance.currency;

    const vrtc_loginid = props.account_list.find(account => account.is_virtual)?.loginid;
    const vrtc_currency = props.accounts[vrtc_loginid] ? props.accounts[vrtc_loginid].currency : 'USD';

    const history = useHistory();

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
        if (props.is_positions_drawer_on) {
            props.togglePositionsDrawer(); // TODO: hide drawer inside logout, once it is a mobx action
        }
        props.routeBackInApp(props.history);
        await props.logoutClient();
    };

    const closeAccountsDialog = () => {
        props.toggleAccountsDialog(false);
    };

    const validateClickOutside = event => props.is_visible && !event.target.classList.contains('acc-info');

    useOnClickOutside(wrapper_ref, closeAccountsDialog, validateClickOutside);

    const setAccountCurrency = () => {
        closeAccountsDialog();
        props.toggleSetCurrencyModal();
    };

    // * mt5_login_list returns these:
    // landing_company_short: "svg" | "malta" | "maltainvest" |  "vanuatu"  | "labuan" | "bvi"
    // account_type: "real" | "demo"
    // market_type: "financial" | "gaming"
    // sub_account_type: "financial" | "financial_stp" | "swap_free"
    //
    // (all market type gaming are synthetic accounts and can only have financial or swap_free sub account)
    //
    // * we should map them to landing_company:
    // mt_financial_company: { financial: {}, financial_stp: {}, swap_free: {} }
    // mt_gaming_company: { financial: {}, swap_free: {} }

    const doSwitch = async loginid => {
        closeAccountsDialog();
        if (props.account_loginid === loginid) return;
        await props.switchAccount(loginid);
    };

    const resetBalance = async () => {
        closeAccountsDialog();
        props.resetVirtualBalance();
    };

    // Real accounts is always the first tab index based on design
    const isRealAccountTab = active_tab_index === 0;
    const isDemoAccountTab = active_tab_index === 1;

    const getRealMT5 = () => {
        const low_risk_non_eu = props.content_flag === ContentFlag.LOW_RISK_CR_NON_EU;
        if (low_risk_non_eu) {
            return getSortedCFDList(props.mt5_login_list).filter(
                account => !isDemo(account) && account.landing_company_short !== 'maltainvest'
            );
        }
        return getSortedCFDList(props.mt5_login_list).filter(account => !isDemo(account));
    };

    const canOpenMulti = () => {
        if (props.available_crypto_currencies.length < 1 && !props.has_fiat) return true;
        return !props.is_virtual;
    };

    const is_regulated_able_to_change_currency =
        props.show_eu_related_content &&
        (props.landing_company_shortcode === 'malta' ||
            (props.landing_company_shortcode === 'iom' && props.upgradeable_landing_companies.length !== 0));

    // SVG clients can't upgrade.
    const getRemainingRealAccounts = () => {
        if (
            props.show_eu_related_content ||
            props.is_virtual ||
            !canOpenMulti() ||
            is_regulated_able_to_change_currency
        ) {
            return props.upgradeable_landing_companies;
        }
        return [];
    };

    const hasSetCurrency = () => {
        return props.account_list.filter(account => !account.is_virtual).some(account => account.title !== 'Real');
    };

    const getTotalDemoAssets = () => {
        const vrtc_balance = props.accounts[vrtc_loginid] ? props.accounts[vrtc_loginid].balance : 0;

        return vrtc_balance;
    };

    const getTotalRealAssets = () => {
        // props.obj_total_balance.amount_mt5 is returning 0 regarding performance issues so we have to calculate
        // the total MT5 accounts balance from props.mt5_login_list.
        // You can remove this part if WS sends obj_total_balance.amount_mt5 correctly.

        const traders_hub_total = props.obj_total_balance.amount_real;

        return traders_hub_total;
    };

    if (!props.is_logged_in) return false;

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
        getSortedAccountList(props.account_list, props.accounts).filter(
            account => !account.is_virtual && account.loginid.startsWith(type)
        ).length > 1;

    // all: 1 in mt5_status response means that server is suspended
    const has_cr_account = props.account_list.find(acc => acc.loginid?.startsWith('CR'))?.loginid;

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
                        {getSortedAccountList(props.account_list, props.accounts)
                            .filter(account => account.is_virtual)
                            .map(account => (
                                <AccountList
                                    is_dark_mode_on={props.is_dark_mode_on}
                                    key={account.loginid}
                                    balance={props.accounts[account.loginid].balance}
                                    currency={props.accounts[account.loginid].currency}
                                    currency_icon={`IcCurrency-${account.icon}`}
                                    country_standpoint={props.country_standpoint}
                                    display_type={'currency'}
                                    has_balance={'balance' in props.accounts[account.loginid]}
                                    has_reset_balance={canResetBalance(props.accounts[props.account_loginid])}
                                    is_disabled={account.is_disabled}
                                    is_virtual={account.is_virtual}
                                    loginid={account.loginid}
                                    redirectAccount={account.is_disabled ? undefined : () => doSwitch(account.loginid)}
                                    onClickResetVirtualBalance={resetBalance}
                                    selected_loginid={props.account_loginid}
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
                {!props.is_eu || props.is_low_risk ? (
                    <React.Fragment>
                        <AccountWrapper
                            className='acc-switcher__title'
                            header={
                                props.is_low_risk
                                    ? localize(`Non-EU Deriv ${have_more_accounts('CR') ? 'accounts' : 'account'}`)
                                    : localize(`Deriv ${have_more_accounts('CR') ? 'accounts' : 'account'}`)
                            }
                            is_visible={is_non_eu_regulator_visible}
                            toggleVisibility={() => {
                                toggleVisibility('real_deriv');
                            }}
                        >
                            <div className='acc-switcher__accounts'>
                                {getSortedAccountList(props.account_list, props.accounts)
                                    .filter(account => !account.is_virtual && account.loginid.startsWith('CR'))
                                    .map(account => {
                                        return (
                                            <AccountList
                                                account_type={props.account_type}
                                                is_dark_mode_on={props.is_dark_mode_on}
                                                key={account.loginid}
                                                balance={props.accounts[account.loginid].balance}
                                                currency={props.accounts[account.loginid].currency}
                                                currency_icon={`IcCurrency-${account.icon}`}
                                                country_standpoint={props.country_standpoint}
                                                display_type={'currency'}
                                                has_balance={'balance' in props.accounts[account.loginid]}
                                                is_disabled={account.is_disabled}
                                                is_virtual={account.is_virtual}
                                                is_eu={props.is_eu}
                                                loginid={account.loginid}
                                                redirectAccount={
                                                    account.is_disabled ? undefined : () => doSwitch(account.loginid)
                                                }
                                                selected_loginid={props.account_loginid}
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
                                                    { account_residence: props.client_residence },
                                                    props.country_standpoint
                                                )}
                                            </Text>
                                            <Button
                                                id='dt_core_account-switcher_add-new-account'
                                                onClick={() => {
                                                    if (props.real_account_creation_unlock_date) {
                                                        closeAccountsDialog();
                                                        props.setShouldShowCooldownModal(true);
                                                    } else props.openRealAccountSignup(account);
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
                {!props.is_high_risk || props.is_eu ? (
                    <AccountWrapper
                        header={
                            props.is_low_risk
                                ? localize(`EU Deriv ${have_more_accounts('MF') ? 'accounts' : 'account'}`)
                                : localize(`Deriv ${have_more_accounts('MF') ? 'accounts' : 'account'}`)
                        }
                        is_visible={is_eu_regulator_visible}
                        toggleVisibility={() => {
                            toggleVisibility('real_deriv');
                        }}
                    >
                        <div className='acc-switcher__accounts'>
                            {getSortedAccountList(props.account_list, props.accounts)
                                .filter(account => !account.is_virtual && account.loginid.startsWith('MF'))
                                .map(account => {
                                    return (
                                        <AccountList
                                            account_type={props.account_type}
                                            is_dark_mode_on={props.is_dark_mode_on}
                                            key={account.loginid}
                                            balance={props.accounts[account.loginid].balance}
                                            currency={props.accounts[account.loginid].currency}
                                            currency_icon={`IcCurrency-${account.icon}`}
                                            country_standpoint={props.country_standpoint}
                                            display_type={'currency'}
                                            has_balance={'balance' in props.accounts[account.loginid]}
                                            is_disabled={account.is_disabled}
                                            is_virtual={account.is_virtual}
                                            is_eu={props.is_eu}
                                            loginid={account.loginid}
                                            redirectAccount={
                                                account.is_disabled ? undefined : () => doSwitch(account.loginid)
                                            }
                                            selected_loginid={props.account_loginid}
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
                                                { account_residence: props.client_residence },
                                                props.country_standpoint
                                            )}
                                        </Text>
                                        <Button
                                            id='dt_core_account-switcher_add-new-account'
                                            onClick={() => {
                                                if (props.real_account_creation_unlock_date) {
                                                    closeAccountsDialog();
                                                    props.setShouldShowCooldownModal(true);
                                                } else {
                                                    props.openRealAccountSignup(account);
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

    const first_real_login_id = props.account_list?.find(account => /^(CR|MF)/.test(account.loginid))?.loginid;

    const TradersHubRedirect = () => {
        const TradersHubLink = () => {
            const handleRedirect = async () => {
                if (!props.is_virtual && isDemoAccountTab) {
                    await props.switchAccount(props.virtual_account_loginid);
                } else if (props.is_virtual && isRealAccountTab) {
                    await props.switchAccount(first_real_login_id);
                }
                props.toggleAccountsDialog(false);
                history.push(routes.traders_hub);
                props.setTogglePlatformType('cfd');
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

        if ((isRealAccountTab && props.has_any_real_account) || isDemoAccountTab) {
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
                    'acc-switcher__separator--auto-margin': props.is_mobile,
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
                {isRealAccountTab && props.has_active_real_account && !props.is_virtual && (
                    <Button
                        className='acc-switcher__btn--traders_hub'
                        secondary
                        onClick={
                            props.has_any_real_account && !hasSetCurrency()
                                ? setAccountCurrency
                                : () => props.openRealAccountSignup('manage')
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
        openAccountNeededModal: ui.openAccountNeededModal,
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
