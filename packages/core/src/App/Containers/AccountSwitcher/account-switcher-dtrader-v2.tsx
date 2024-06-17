import React from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { Icon, useOnClickOutside, Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { routes, ContentFlag } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useHasSetCurrency } from '@deriv/hooks';
import { getAccountTitle } from 'App/Containers/RealAccountSignup/helpers/constants';
import { BinaryLink } from 'App/Components/Routes';
import { Button, Text } from '@deriv-com/quill-ui';
import { getSortedAccountList, getSortedCFDList, isDemo } from './helpers';
import { LabelPairedChevronRightSmRegularIcon } from '@deriv/quill-icons';
import AccountListDTraderV2 from './account-switcher-account-list-dtrader-v2';
import { TActiveAccount } from '@deriv/stores/types';

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
        switchAccount,
        resetVirtualBalance,
        has_active_real_account,
        upgradeable_landing_companies,
        real_account_creation_unlock_date,
        has_any_real_account,
        has_maltainvest_account,
    } = client;
    const { show_eu_related_content, content_flag, selectRegion, setTogglePlatformType } = traders_hub;
    const { openRealAccountSignup, toggleAccountsDialog, toggleSetCurrencyModal, setShouldShowCooldownModal } = ui;

    const wrapper_ref = React.useRef<HTMLDivElement>(null);
    const scroll_ref = React.useRef(null);

    const vrtc_loginid = account_list.find(account => account.is_virtual)?.loginid ?? '';

    // TODO: Check unused css

    // const handleLogout = async () => {
    //     closeAccountsDialog();
    //     if (is_positions_drawer_on) {
    //         togglePositionsDrawer(); // TODO: hide drawer inside logout, once it is a mobx action
    //     }

    //     // for DBot we need to logout first and only after this redirect to TH
    //     if (window.location.pathname.startsWith(routes.bot)) {
    //         await logoutClient();
    //         history.push(routes.traders_hub);
    //     } else {
    //         history.push(routes.traders_hub);
    //         await logoutClient();
    //     }
    // };

    const closeAccountsDialog = () => {
        toggleAccountsDialog(false);
    };

    const validateClickOutside = (event: MouseEvent) =>
        !!is_visible && !(event.target as Element).classList.contains('acc-info');

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

    const getRealMT5 = (): typeof mt5_login_list | [] => {
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
    const getRemainingRealAccounts = (): string[] | [] => {
        if (show_eu_related_content || is_virtual || !canOpenMulti() || is_low_risk) {
            return upgradeable_landing_companies;
        }
        return [];
    };

    const hasSetCurrency = useHasSetCurrency();

    const canResetBalance = (account: TActiveAccount) => {
        const account_init_balance = 10000;
        return !!account?.is_virtual && account?.balance !== account_init_balance;
    };

    const checkMultipleSvgAcc = () => {
        const all_svg_acc: typeof mt5_login_list = [];
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
        <React.Fragment>
            {!!vrtc_loginid && (
                <React.Fragment>
                    {getSortedAccountList(account_list, accounts)
                        .filter(account => account.is_virtual)
                        .map(account => (
                            <AccountListDTraderV2
                                key={account.loginid}
                                balance={accounts[account.loginid].balance}
                                currency={accounts[account.loginid].currency}
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
                </React.Fragment>
            )}
        </React.Fragment>
    );

    const real_accounts = (
        <div ref={scroll_ref}>
            {!is_eu || is_low_risk ? (
                <React.Fragment>
                    {is_low_risk && has_maltainvest_account
                        ? localize(`Non-EU Deriv ${have_more_accounts('CR') ? 'accounts' : 'account'}`)
                        : localize(`Deriv ${have_more_accounts('CR') ? 'accounts' : 'account'}`)}
                    {getSortedAccountList(account_list, accounts)
                        .filter(account => !account.is_virtual && account.loginid.startsWith('CR'))
                        .map(account => {
                            return (
                                <AccountListDTraderV2
                                    key={account.loginid}
                                    balance={accounts[account.loginid].balance}
                                    currency={accounts[account.loginid].currency}
                                    display_type={'currency'}
                                    has_balance={'balance' in accounts[account.loginid]}
                                    is_disabled={account.is_disabled}
                                    is_virtual={account.is_virtual}
                                    is_eu={is_eu}
                                    loginid={account.loginid}
                                    redirectAccount={account.is_disabled ? undefined : () => doSwitch(account.loginid)}
                                    selected_loginid={account_loginid}
                                    should_show_server_name={checkMultipleSvgAcc()}
                                />
                            );
                        })}
                    {!has_cr_account &&
                        getRemainingRealAccounts()
                            .filter(account => account === 'svg')
                            .map(account => (
                                <div key={account} className='acc-switcher__new-account'>
                                    <Icon icon='IcDeriv' size={24} />
                                    <Text size='sm'>{getAccountTitle(account as string)}</Text>
                                    <Button
                                        onClick={() => {
                                            if (real_account_creation_unlock_date) {
                                                closeAccountsDialog();
                                                setShouldShowCooldownModal(true);
                                            } else {
                                                selectRegion('Non-EU');
                                                openRealAccountSignup('svg');
                                            }
                                        }}
                                        color='black'
                                        label={<Localize i18n_default_text='Add' />}
                                        type='button'
                                        variant='secondary'
                                    />
                                </div>
                            ))}
                    {/* </AccountWrapper> */}
                </React.Fragment>
            ) : null}
            {(!is_high_risk || is_eu) && has_maltainvest_account ? (
                <React.Fragment>
                    {is_low_risk && has_maltainvest_account
                        ? localize(`EU Deriv ${have_more_accounts('MF') ? 'accounts' : 'account'}`)
                        : localize(`Deriv ${have_more_accounts('MF') ? 'accounts' : 'account'}`)}
                    {getSortedAccountList(account_list, accounts)
                        .filter(account => !account.is_virtual && account.loginid.startsWith('MF'))
                        .map(account => (
                            <AccountListDTraderV2
                                key={account.loginid}
                                balance={accounts[account.loginid].balance}
                                currency={accounts[account.loginid].currency}
                                display_type={'currency'}
                                has_balance={'balance' in accounts[account.loginid]}
                                is_disabled={account.is_disabled}
                                is_virtual={account.is_virtual}
                                is_eu={is_eu}
                                loginid={account.loginid}
                                redirectAccount={account.is_disabled ? undefined : () => doSwitch(account.loginid)}
                                selected_loginid={account_loginid}
                                should_show_server_name={checkMultipleSvgAcc()}
                            />
                        ))}
                    {getRemainingRealAccounts()
                        .filter(account => account === 'maltainvest')
                        .map(account => (
                            <div key={account} className='acc-switcher__new-account'>
                                <Icon icon='IcDeriv' size={24} />
                                <Text size='sm'>{getAccountTitle(account as string)}</Text>
                                <Button
                                    onClick={() => {
                                        if (real_account_creation_unlock_date) {
                                            closeAccountsDialog();
                                            setShouldShowCooldownModal(true);
                                        } else {
                                            selectRegion('EU');
                                            openRealAccountSignup('maltainvest');
                                        }
                                    }}
                                    color='black'
                                    label={<Localize i18n_default_text='Add' />}
                                    type='button'
                                    variant='secondary'
                                />
                            </div>
                        ))}
                </React.Fragment>
            ) : null}
        </div>
    );

    const handleRedirect = () => {
        // TODO: temporary unused?
        // const first_real_login_id = account_list?.find(account => /^(CR|MF)/.test(account.loginid ?? ''))?.loginid;
        // if (!is_virtual) {
        //     await switchAccount(virtual_account_loginid);
        // } else if (is_virtual) {
        //     await switchAccount(first_real_login_id);
        // }
        toggleAccountsDialog(false);
        history.push(routes.traders_hub);
        setTogglePlatformType('cfd');
    };

    if (!is_logged_in) return null;

    return (
        <div className='acc-switcher-dtrader__wrapper' ref={wrapper_ref}>
            {is_landing_company_loaded ? (
                <React.Fragment>
                    <div>
                        {real_accounts}
                        {demo_account}
                    </div>
                    <BinaryLink onClick={handleRedirect} className='acc-switcher-dtrader__traders-hub'>
                        <Text size='sm'>
                            <Localize i18n_default_text="Looking for CFD accounts? Go to Trader's Hub" />
                        </Text>
                        <LabelPairedChevronRightSmRegularIcon />
                    </BinaryLink>
                    {has_active_real_account && !is_virtual && (
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
                            fullWidth
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
                // TODO: it's old Loader from current production. Add new?
                <Loading is_fullscreen={false} />
            )}
        </div>
    );
});

export default withRouter(AccountSwitcherDTraderV2);
