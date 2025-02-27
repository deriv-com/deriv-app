import React from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Jurisdiction, routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useHasSetCurrency } from '@deriv/hooks';
import { TActiveAccount } from '@deriv/stores/types';
import { LabelPairedChevronRightSmRegularIcon, StandaloneDerivIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/quill-ui';
import { getAccountTitle } from 'App/Containers/RealAccountSignup/helpers/constants';
import { BinaryLink } from 'App/Components/Routes';
import { BROKER_CODE } from './Utils/account-switcher-dtrader-v2-utils';
import AccountListDTraderV2 from './account-switcher-account-list-dtrader-v2';
import AccountGroupWrapper from './account-group-wrapper-dtrader-v2';
import { getSortedAccountList } from '../../../../Containers/AccountSwitcher/helpers';

type TAccountSwitcherDTraderV2 = RouteComponentProps & {
    history?: ReturnType<typeof useHistory>;
};

const AccountSwitcherDTraderV2 = observer(({ history }: TAccountSwitcherDTraderV2) => {
    const [is_closing, setIsClosing] = React.useState(false);

    const { client, ui, traders_hub } = useStore();
    const {
        available_crypto_currencies,
        accounts,
        account_list,
        currency,
        has_fiat,
        has_active_real_account,
        has_any_real_account,
        has_maltainvest_account,
        is_eu,
        is_landing_company_loaded,
        is_low_risk,
        is_high_risk,
        is_logged_in,
        is_logging_in,
        is_virtual,
        loginid: account_loginid,
        is_mt5_allowed,
        switchAccount,
        resetVirtualBalance,
        upgradeable_landing_companies,
        real_account_creation_unlock_date,
    } = client;
    const { show_eu_related_content, selectRegion, setTogglePlatformType } = traders_hub;
    const { openRealAccountSignup, setShouldShowCooldownModal, toggleAccountsDialog, toggleSetCurrencyModal } = ui;

    const vrtc_loginid = account_list.find(account => account.is_virtual)?.loginid ?? '';
    const has_set_currency = useHasSetCurrency();
    const has_cr_account = account_list.find(acc => acc.loginid?.startsWith(BROKER_CODE.CR))?.loginid;
    const show_separator = is_low_risk && has_maltainvest_account;
    const show_button =
        (has_active_real_account && !is_virtual && !is_closing) || (is_virtual && !has_any_real_account);

    const closeAccountsDialog = () => {
        toggleAccountsDialog(false);
    };

    const setAccountCurrency = () => {
        closeAccountsDialog();
        toggleSetCurrencyModal();
    };

    const handleSwitchAccount = async (loginid?: string) => {
        setIsClosing(true);

        if (account_loginid === loginid) {
            setIsClosing(false);
            return;
        }

        closeAccountsDialog();
        await switchAccount(loginid);
        setIsClosing(false);
    };

    const resetBalance = async () => {
        closeAccountsDialog();
        await resetVirtualBalance();
    };

    const canOpenMultiple = () => (available_crypto_currencies.length < 1 && !has_fiat ? true : !is_virtual);

    const getRemainingRealAccounts = (): string[] | [] => {
        if (show_eu_related_content || is_virtual || !canOpenMultiple() || is_low_risk) {
            return upgradeable_landing_companies;
        }
        return [];
    };

    const isAbleToResetBalance = (account: TActiveAccount) => {
        const account_init_balance = 10000;
        return !!account?.is_virtual && account?.balance !== account_init_balance;
    };

    const hasMoreAccounts = (type?: string) =>
        getSortedAccountList(account_list, accounts).filter(
            account => !account.is_virtual && account.loginid.startsWith(type)
        ).length > 1;

    const handleRedirect = () => {
        toggleAccountsDialog(false);
        history.push(routes.traders_hub);
        setTogglePlatformType('cfd');
    };

    const handleManageAccounts =
        has_any_real_account && (!has_set_currency || !currency)
            ? setAccountCurrency
            : () => openRealAccountSignup('manage');

    const openRealAccount = () => {
        if (real_account_creation_unlock_date) {
            setShouldShowCooldownModal(true);
        } else {
            selectRegion(is_eu ? 'EU' : 'Non-EU');
            openRealAccountSignup(is_eu && !is_low_risk ? Jurisdiction.MALTA_INVEST : Jurisdiction.SVG);
        }
    };

    const getAccountItem = (item: (typeof account_list)[0], is_demo?: boolean) => (
        <AccountListDTraderV2
            key={item.loginid}
            balance={accounts[item?.loginid ?? '']?.balance}
            currency={accounts[item?.loginid ?? '']?.currency}
            has_balance={'balance' in accounts[item?.loginid ?? '']}
            has_reset_balance={is_demo && isAbleToResetBalance(accounts[account_loginid ?? ''])}
            is_disabled={!!item.is_disabled}
            is_virtual={item.is_virtual}
            loginid={item.loginid}
            redirectAccount={item.is_disabled ? undefined : () => handleSwitchAccount(item.loginid)}
            onClickResetVirtualBalance={is_demo ? resetBalance : undefined}
            selected_loginid={account_loginid}
        />
    );

    const getAddAccountButton = (account: string) => (
        <div key={account} className='acc-switcher-dtrader__new-account'>
            <StandaloneDerivIcon iconSize='sm' />
            <Text size='sm' className='acc-switcher-dtrader__new-account__info'>
                {getAccountTitle(account)}
            </Text>
            <Button
                onClick={openRealAccount}
                color='black'
                label={<Localize i18n_default_text='Add' />}
                type='button'
                variant='secondary'
                size='md'
            />
        </div>
    );

    const demo_account = (
        <React.Fragment>
            {!!vrtc_loginid && (
                <AccountGroupWrapper separator_text={show_separator && <Localize i18n_default_text='Demo account' />}>
                    {(getSortedAccountList(account_list, accounts) as typeof account_list)
                        .filter(account => account.is_virtual)
                        .map(account => getAccountItem(account, true))}
                </AccountGroupWrapper>
            )}
        </React.Fragment>
    );

    const real_accounts = (
        <React.Fragment>
            {(!is_eu || is_low_risk) && (
                <AccountGroupWrapper
                    separator_text={
                        is_low_risk &&
                        has_maltainvest_account &&
                        localize(`Non-EU Deriv ${hasMoreAccounts(BROKER_CODE.CR) ? 'accounts' : 'account'}`)
                    }
                    show_bottom_separator
                >
                    {(getSortedAccountList(account_list, accounts) as typeof account_list)
                        .filter(account => !account.is_virtual && account?.loginid?.startsWith(BROKER_CODE.CR))
                        .map(account => getAccountItem(account))}
                    {!has_cr_account &&
                        is_low_risk &&
                        has_maltainvest_account &&
                        getRemainingRealAccounts()
                            .filter(account => account === Jurisdiction.SVG)
                            .map(account => getAddAccountButton(account))}
                </AccountGroupWrapper>
            )}
            {((!is_high_risk && has_maltainvest_account) || is_eu) && (
                <AccountGroupWrapper
                    separator_text={
                        is_low_risk && localize(`EU Deriv ${hasMoreAccounts(BROKER_CODE.MF) ? 'accounts' : 'account'}`)
                    }
                    show_bottom_separator
                >
                    {(getSortedAccountList(account_list, accounts) as typeof account_list)
                        .filter(account => !account.is_virtual && account?.loginid?.startsWith(BROKER_CODE.MF))
                        .map(account => getAccountItem(account))}
                    {getRemainingRealAccounts()
                        .filter(account => account === Jurisdiction.MALTA_INVEST)
                        .map(account => getAddAccountButton(account))}
                </AccountGroupWrapper>
            )}
        </React.Fragment>
    );

    if (!is_logged_in) return null;
    if (is_logging_in) return <Loading is_fullscreen={false} />;
    return (
        <div className='acc-switcher-dtrader__wrapper'>
            {is_landing_company_loaded ? (
                <React.Fragment>
                    <div
                        className={classNames('acc-switcher-dtrader__accounts-list', {
                            'acc-switcher-dtrader__accounts-list--with-button': show_button,
                            'acc-switcher-dtrader__accounts-list--with-cfd-banner': is_mt5_allowed,
                            'acc-switcher-dtrader__accounts-list--with-both': show_button && is_mt5_allowed,
                        })}
                    >
                        {real_accounts}
                        {demo_account}
                    </div>
                    {is_mt5_allowed && (
                        <BinaryLink onClick={handleRedirect} className='acc-switcher-dtrader__traders-hub'>
                            <Text size='sm'>
                                <Localize i18n_default_text="Looking for CFD accounts? Go to Trader's Hub" />
                            </Text>
                            <LabelPairedChevronRightSmRegularIcon />
                        </BinaryLink>
                    )}
                    {show_button && (
                        <Button
                            color='black'
                            label={
                                has_any_real_account ? (
                                    <Localize i18n_default_text='Manage accounts' />
                                ) : (
                                    <Localize i18n_default_text='Add real account' />
                                )
                            }
                            onClick={has_any_real_account ? handleManageAccounts : openRealAccount}
                            size='lg'
                            type='button'
                            variant='secondary'
                            fullWidth
                        />
                    )}
                </React.Fragment>
            ) : (
                <Loading is_fullscreen={false} />
            )}
        </div>
    );
});

export default withRouter(AccountSwitcherDTraderV2);
