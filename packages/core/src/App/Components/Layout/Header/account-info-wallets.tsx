import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Icon, WalletIcon, Badge } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { formatMoney } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import {
    useActiveAccount,
    useActiveWalletAccount,
    useLinkedWalletsAccounts,
    useWalletAccountsList,
} from '@deriv/hooks';
import { AccountSwitcherWallet } from 'App/Containers/AccountSwitcherWallet';
import { AccountsInfoLoader } from './Components/Preloader';
import AccountSwitcherMobile from 'App/Containers/AccountSwitcher/account-switcher-mobile';
import AccountInfoWrapper from './account-info-wrapper';
import AccountInfoIcon from './account-info-icon';

type TAccountInfoWallets = {
    toggleDialog: () => void;
    is_dialog_on: boolean;
};

const AccountInfoWallets = observer(({ is_dialog_on, toggleDialog }: TAccountInfoWallets) => {
    const { client, ui } = useStore();
    const { switchAccount, is_logged_in } = client;
    const { is_mobile, account_switcher_disabled_message, disableApp, enableApp, is_dark_mode_on } = ui;

    const active_account = useActiveAccount();
    const active_wallet = useActiveWalletAccount();
    const { data: wallets_list } = useWalletAccountsList();
    const { data: linked_accounts } = useLinkedWalletsAccounts();

    let linked_dtrade_trading_account_loginind = active_account?.loginid;

    if (active_wallet) {
        // get 'dtrade' loginid account linked to the current wallet
        linked_dtrade_trading_account_loginind = active_wallet.dtrade_loginid || linked_accounts.dtrade?.[0]?.loginid;

        // switch to dtrade account
        if (
            linked_dtrade_trading_account_loginind &&
            linked_dtrade_trading_account_loginind !== active_account?.loginid
        ) {
            switchAccount(linked_dtrade_trading_account_loginind);
        }
    }

    const linked_wallet = wallets_list?.find(
        wallet => wallet.dtrade_loginid === linked_dtrade_trading_account_loginind
    );

    if (!linked_wallet) return <AccountsInfoLoader is_logged_in={is_logged_in} is_mobile={is_mobile} speed={3} />;

    return (
        <div className='acc-info__wrapper'>
            <div className='acc-info__separator' />
            <AccountInfoWrapper
                is_disabled={active_account?.is_disabled}
                disabled_message={account_switcher_disabled_message}
            >
                <div
                    data-testid='dt_acc_info'
                    id='dt_core_account-info_acc-info'
                    className={classNames('acc-info acc-info__wallets', {
                        'acc-info--show': is_dialog_on,
                        'acc-info--is-disabled': active_account?.is_disabled,
                    })}
                    onClick={active_account?.is_disabled ? undefined : () => toggleDialog()}
                >
                    {is_mobile ? (
                        <span className='acc-info__id'>
                            (active_account?.is_virtual || active_account?.currency) && (
                            <AccountInfoIcon
                                is_virtual={active_account?.is_virtual}
                                currency={active_account?.currency?.toLowerCase()}
                            />
                            )
                        </span>
                    ) : (
                        <div className='acc-info__wallets-container'>
                            <Icon
                                icon={is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight'}
                                size={24}
                                data_testid='dt_ic_wallet_options'
                            />
                            <WalletIcon
                                icon={is_dark_mode_on ? linked_wallet?.icons.dark : linked_wallet?.icons.light}
                                type={linked_wallet?.is_virtual ? 'demo' : linked_wallet?.currency_config?.type}
                                gradient_class={
                                    is_dark_mode_on
                                        ? linked_wallet?.gradients.card.dark
                                        : linked_wallet?.gradients.card.light
                                }
                                size={'small'}
                                has_bg
                                hide_watermark
                            />
                            {linked_wallet?.is_virtual ? (
                                <Badge type='contained' background_color='blue' label={localize('Demo')} />
                            ) : (
                                <Badge
                                    type='bordered'
                                    label={linked_wallet?.landing_company_name?.toUpperCase() || ''}
                                />
                            )}
                        </div>
                    )}
                    {(typeof active_account?.balance !== 'undefined' || !active_account?.currency) && (
                        <div className='acc-info__wallets-account-type-and-balance'>
                            <p
                                data-testid='dt_balance'
                                className={classNames('acc-info__balance', {
                                    'acc-info__balance--no-currency':
                                        !active_account?.currency && !active_account?.is_virtual,
                                    'acc-info__wallets-is-virtual-balance':
                                        active_account?.currency && active_account?.is_virtual,
                                })}
                            >
                                {!active_account?.currency ? (
                                    <Localize i18n_default_text='No currency assigned' />
                                ) : (
                                    `${formatMoney(active_account?.currency, active_account?.balance, true)} ${
                                        active_account?.currency_config?.display_code
                                    }`
                                )}
                            </p>
                        </div>
                    )}
                    {active_account?.is_disabled ? (
                        <Icon data_testid='dt_lock_icon' icon='IcLock' />
                    ) : (
                        <Icon
                            data_testid='dt_select_arrow'
                            icon='IcChevronDownBold'
                            className='acc-info__select-arrow'
                        />
                    )}
                </div>
            </AccountInfoWrapper>
            {is_mobile ? (
                <AccountSwitcherMobile
                    is_visible={is_dialog_on}
                    disableApp={disableApp}
                    enableApp={enableApp}
                    toggle={toggleDialog}
                />
            ) : (
                <CSSTransition
                    in={is_dialog_on}
                    timeout={200}
                    classNames={{
                        enter: 'acc-switcher__wrapper--enter',
                        enterDone: 'acc-switcher__wrapper--enter-done',
                        exit: 'acc-switcher__wrapper--exit',
                    }}
                    unmountOnExit
                >
                    <div className='acc-switcher__wrapper'>
                        <AccountSwitcherWallet is_visible={is_dialog_on} toggle={toggleDialog} />
                    </div>
                </CSSTransition>
            )}
        </div>
    );
});

export default AccountInfoWallets;
