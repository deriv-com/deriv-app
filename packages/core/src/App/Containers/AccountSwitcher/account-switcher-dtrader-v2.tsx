import React from 'react';
import classNames from 'classnames';
// import { withRouter } from 'react-router';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { Icon, Text, useOnClickOutside, Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { routes, formatMoney, ContentFlag } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useHasSetCurrency } from '@deriv/hooks';
import { getAccountTitle } from 'App/Containers/RealAccountSignup/helpers/constants';
import { BinaryLink } from 'App/Components/Routes';
import AccountList from './account-switcher-account-list.jsx';
import AccountWrapper from './account-switcher-account-wrapper.jsx';
import { Button } from '@deriv-com/quill-ui';
import { getSortedAccountList, getSortedCFDList, isDemo } from './helpers';

type TAccountSwitcherDTraderV2 = RouteComponentProps & {
    is_mobile?: boolean;
    is_visible?: boolean;
    history?: ReturnType<typeof useHistory>;
};

const AccountSwitcherDTraderV2 = observer(({ is_mobile, is_visible, history }: TAccountSwitcherDTraderV2) => {
    const { client, ui, traders_hub } = useStore();
    const {
        available_crypto_currencies,
        loginid: account_loginid,
        accounts,
        account_type,
        account_list,
        currency,
        is_eu,
        is_landing_company_loaded,
        is_low_risk,
        is_high_risk,
        is_logged_in,
        is_virtual,
        has_fiat,
        mt5_login_list,
        obj_total_balance,
        switchAccount,
        resetVirtualBalance,
        has_active_real_account,
        logout: logoutClient,
        upgradeable_landing_companies,
        real_account_creation_unlock_date,
        has_any_real_account,
        virtual_account_loginid,
        has_maltainvest_account,
    } = client;
    const { show_eu_related_content, content_flag, selectRegion, setTogglePlatformType } = traders_hub;
    const {
        is_dark_mode_on,
        is_positions_drawer_on,
        openRealAccountSignup,
        toggleAccountsDialog,
        togglePositionsDrawer,
        toggleSetCurrencyModal,
        should_show_real_accounts_list,
        setShouldShowCooldownModal,
    } = ui;
    // const [active_tab_index, setActiveTabIndex] = React.useState(!is_virtual || should_show_real_accounts_list ? 0 : 1);
    // const [is_deriv_demo_visible, setDerivDemoVisible] = React.useState(true);
    // const [is_deriv_real_visible, setDerivRealVisible] = React.useState(true);
    // const [is_non_eu_regulator_visible, setNonEuRegulatorVisible] = React.useState(true);
    // const [is_eu_regulator_visible, setEuRegulatorVisible] = React.useState(true);

    const wrapper_ref = React.useRef<HTMLDivElement>(null);
    const scroll_ref = React.useRef(null);

    // const account_total_balance_currency = obj_total_balance.currency;

    const vrtc_loginid = account_list.find(account => account.is_virtual)?.loginid ?? '';
    // const vrtc_currency = accounts[vrtc_loginid] ? accounts[vrtc_loginid].currency : 'USD';

    // const toggleVisibility = (section?: string) => {
    //     switch (section) {
    //         case 'demo_deriv':
    //             return setDerivDemoVisible(!is_deriv_demo_visible);
    //         case 'real_deriv':
    //             return setDerivRealVisible(!is_deriv_real_visible);
    //         case 'non-eu-regulator':
    //             return setNonEuRegulatorVisible(!is_non_eu_regulator_visible);
    //         case 'eu-regulator':
    //             return setEuRegulatorVisible(!is_eu_regulator_visible);
    //         default:
    //             return false;
    //     }
    // };

    const handleLogout = async () => {
        closeAccountsDialog();
        if (is_positions_drawer_on) {
            togglePositionsDrawer(); // TODO: hide drawer inside logout, once it is a mobx action
        }

        // for DBot we need to logout first and only after this redirect to TH
        if (window.location.pathname.startsWith(routes.bot)) {
            await logoutClient();
            history.push(routes.traders_hub);
        } else {
            history.push(routes.traders_hub);
            await logoutClient();
        }
    };

    const closeAccountsDialog = () => {
        toggleAccountsDialog(false);
    };

    const validateClickOutside = (event: MouseEvent) => is_visible && !event.target.classList.contains('acc-info');

    useOnClickOutside(wrapper_ref, closeAccountsDialog, validateClickOutside);

    const setAccountCurrency = () => {
        closeAccountsDialog();
        toggleSetCurrencyModal();
    };

    const doSwitch = async (loginid?: string) => {
        closeAccountsDialog();
        if (account_loginid === loginid) return;
        await switchAccount(loginid);
    };

    const resetBalance = async () => {
        closeAccountsDialog();
        resetVirtualBalance();
    };

    // Real accounts is always the first tab index based on design
    // const isRealAccountTab = active_tab_index === 0;
    // const isDemoAccountTab = active_tab_index === 1;

    const getRealMT5 = () => {
        if (is_landing_company_loaded) {
            const low_risk_non_eu = content_flag === ContentFlag.LOW_RISK_CR_NON_EU;
            if (low_risk_non_eu) {
                return getSortedCFDList(mt5_login_list).filter(
                    account => !isDemo(account) && account.landing_company_short !== 'maltainvest'
                );
            }
            return getSortedCFDList(mt5_login_list).filter(account => !isDemo(account));
        }
        return [];
    };

    const canOpenMulti = () => {
        if (available_crypto_currencies.length < 1 && !has_fiat) return true;
        return !is_virtual;
    };

    // SVG clients can't upgrade.
    const getRemainingRealAccounts = () => {
        if (show_eu_related_content || is_virtual || !canOpenMulti() || is_low_risk) {
            return upgradeable_landing_companies;
        }
        return [];
    };

    const hasSetCurrency = useHasSetCurrency();

    // const getTotalDemoAssets = () => {
    //     const vrtc_balance = accounts[vrtc_loginid] ? accounts[vrtc_loginid].balance : 0;

    //     return vrtc_balance;
    // };

    // const getTotalRealAssets = () => {
    //     const traders_hub_total = obj_total_balance.amount_real;
    //     return traders_hub_total;
    // };

    if (!is_logged_in) return false;

    const canResetBalance = account => {
        const account_init_balance = 10000;
        return account?.is_virtual && account?.balance !== account_init_balance;
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

    const have_more_accounts = (type?: string) =>
        getSortedAccountList(account_list, accounts).filter(
            account => !account.is_virtual && account.loginid.startsWith(type)
        ).length > 1;

    // all: 1 in mt5_status response means that server is suspended
    const has_cr_account = account_list.find(acc => acc.loginid?.startsWith('CR'))?.loginid;

    const demo_account = (
        <div className='acc-switcher__list-wrapper'>
            {vrtc_loginid && (
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
                                display_type={'currency'}
                                has_balance={'balance' in accounts[account.loginid]}
                                has_reset_balance={canResetBalance(accounts[account_loginid ?? ''])}
                                is_disabled={account.is_disabled}
                                is_virtual={account.is_virtual}
                                loginid={account.loginid}
                                redirectAccount={account.is_disabled ? undefined : () => doSwitch(account.loginid)}
                                onClickResetVirtualBalance={resetBalance}
                                selected_loginid={account_loginid}
                            />
                        ))}
                </div>
            )}
        </div>
    );

    const real_accounts = (
        <div ref={scroll_ref} className='acc-switcher__list-wrapper'>
            <React.Fragment>
                {!is_eu || is_low_risk ? (
                    <React.Fragment>
                        {/* <AccountWrapper
                            className='acc-switcher__title'
                            header={
                                is_low_risk && has_maltainvest_account
                                    ? localize(`Non-EU Deriv ${have_more_accounts('CR') ? 'accounts' : 'account'}`)
                                    : localize(`Deriv ${have_more_accounts('CR') ? 'accounts' : 'account'}`)
                            }
                            is_visible={is_non_eu_regulator_visible}
                            toggleVisibility={() => {
                                toggleVisibility('real_deriv');
                            }}
                        > */}
                        <div>
                            {is_low_risk && has_maltainvest_account
                                ? localize(`Non-EU Deriv ${have_more_accounts('CR') ? 'accounts' : 'account'}`)
                                : localize(`Deriv ${have_more_accounts('CR') ? 'accounts' : 'account'}`)}
                        </div>
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
                                            {getAccountTitle(account)}
                                        </Text>
                                        <Button
                                            id='dt_core_account-switcher_add-new-account'
                                            onClick={() => {
                                                if (real_account_creation_unlock_date) {
                                                    closeAccountsDialog();
                                                    setShouldShowCooldownModal(true);
                                                } else {
                                                    selectRegion('Non-EU');
                                                    openRealAccountSignup('svg');
                                                }
                                            }}
                                            className='acc-switcher__new-account-btn'
                                            secondary
                                            small
                                        >
                                            {localize('Add')}
                                        </Button>
                                    </div>
                                ))}
                        {/* </AccountWrapper> */}
                        <div className='acc-switcher__separator' />
                    </React.Fragment>
                ) : null}
                {(!is_high_risk || is_eu) && has_maltainvest_account ? (
                    <React.Fragment>
                        {/* <AccountWrapper
                            header={
                                is_low_risk && has_maltainvest_account
                                    ? localize(`EU Deriv ${have_more_accounts('MF') ? 'accounts' : 'account'}`)
                                    : localize(`Deriv ${have_more_accounts('MF') ? 'accounts' : 'account'}`)
                            }
                            is_visible={is_eu_regulator_visible}
                            toggleVisibility={() => {
                                toggleVisibility('real_deriv');
                            }}
                        > */}
                        <div>
                            {is_low_risk && has_maltainvest_account
                                ? localize(`EU Deriv ${have_more_accounts('MF') ? 'accounts' : 'account'}`)
                                : localize(`Deriv ${have_more_accounts('MF') ? 'accounts' : 'account'}`)}
                        </div>
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
                                            {getAccountTitle(account)}
                                        </Text>
                                        <Button
                                            id='dt_core_account-switcher_add-new-account'
                                            onClick={() => {
                                                if (real_account_creation_unlock_date) {
                                                    closeAccountsDialog();
                                                    setShouldShowCooldownModal(true);
                                                } else {
                                                    selectRegion('EU');
                                                    openRealAccountSignup('maltainvest');
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
                        {/* </AccountWrapper> */}
                    </React.Fragment>
                ) : null}
            </React.Fragment>
        </div>
    );

    const first_real_login_id = account_list?.find(account => /^(CR|MF)/.test(account.loginid ?? ''))?.loginid;

    const TradersHubRedirect = () => {
        const TradersHubLink = () => {
            const handleRedirect = async () => {
                if (!is_virtual) {
                    await switchAccount(virtual_account_loginid);
                } else if (is_virtual) {
                    await switchAccount(first_real_login_id);
                }
                toggleAccountsDialog(false);
                history.push(routes.traders_hub);
                setTogglePlatformType('cfd');
            };

            return (
                <div className='acc-switcher__traders-hub'>
                    <BinaryLink onClick={handleRedirect} className='acc-switcher__traders-hub--link'>
                        <Text size='xs' align='center' className='acc-switcher__traders-hub--text'>
                            <Localize i18n_default_text="Looking for CFD accounts? Go to Trader's Hub" />
                        </Text>
                    </BinaryLink>
                </div>
            );
        };

        // if ((isRealAccountTab && has_any_real_account) || isDemoAccountTab) {
        //     return <TradersHubLink />;
        // }

        // return null;

        return <TradersHubLink />;
    };

    return (
        <div className='acc-switcher-dtrader__wrapper' ref={wrapper_ref}>
            {is_landing_company_loaded ? (
                <React.Fragment>
                    <div>
                        {real_accounts}
                        {demo_account}
                    </div>
                    <TradersHubRedirect />
                    {has_active_real_account && (
                        <Button
                            color='black'
                            label={<Localize i18n_default_text='Manage accounts' />}
                            onClick={
                                has_any_real_account && (!hasSetCurrency || !currency)
                                    ? setAccountCurrency
                                    : () => openRealAccountSignup('manage')
                            }
                            size='lg'
                            type='button'
                            variant='secondary'
                        />
                    )}
                    {/* TODO: Temporary leave log out option for internal developer testing */}
                    {/* <div id='dt_logout_button' className='acc-switcher__logout' onClick={handleLogout}>
                        <Text color='prominent' size='xs' align='left' className='acc-switcher__logout-text'>
                            {localize('Log out')}
                        </Text>
                        <Icon icon='IcLogout' className='acc-switcher__logout-icon drawer__icon' />
                    </div> */}
                </React.Fragment>
            ) : (
                <Loading is_fullscreen={false} />
            )}
        </div>
    );
});

export default withRouter(AccountSwitcherDTraderV2);
