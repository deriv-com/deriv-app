import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Icon, WalletIcon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { formatMoney, getCurrencyDisplayCode } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { useStoreWalletAccountsList, useStoreLinkedWalletsAccounts } from '@deriv/hooks';
import { AccountSwitcherWallet } from 'App/Containers/AccountSwitcherWallet';
import { AccountsInfoLoader } from '../Components/Preloader';
import AccountSwitcherMobile from 'App/Containers/AccountSwitcher/account-switcher-mobile';
import AccountInfoWrapper from '../account-info-wrapper';
import AccountInfoIcon from '../account-info-icon';
import WalletBadge from './wallet-badge';

type TAccountInfoWallets = {
    toggleDialog: () => void;
    is_dialog_on: boolean;
};

type TDropdownArrow = {
    is_disabled?: boolean;
};

type TBalanceLabel = {
    balance: number;
    currency: string;
    is_virtual: boolean;
    display_code: string;
};

type TMobileInfoIcon = {
    currency: string;
    is_virtual: boolean;
};

type TDesktopInfoIcons = {
    wallet_account: ReturnType<typeof useStoreWalletAccountsList>['data'][number];
    active_account: TStores['client']['accounts'][number];
    show_badge?: boolean;
};

const DropdownArrow = ({ is_disabled = false }: TDropdownArrow) =>
    is_disabled ? (
        <Icon data_testid='dt_lock_icon' icon='IcLock' />
    ) : (
        <Icon data_testid='dt_select_arrow' icon='IcChevronDownBold' className='acc-info__select-arrow' />
    );

const BalanceLabel = ({ balance, currency, is_virtual, display_code }: Partial<TBalanceLabel>) =>
    (typeof balance !== 'undefined' || !currency) && (
        <div className='acc-info__wallets-account-type-and-balance'>
            <Text
                as='p'
                data-testid='dt_balance'
                className={classNames('acc-info__balance acc-info__wallets-balance', {
                    'acc-info__balance--no-currency': !currency && !is_virtual,
                })}
            >
                {!currency ? (
                    <Localize i18n_default_text='No currency assigned' />
                ) : (
                    `${formatMoney(currency, balance ?? 0, true)} ${display_code}`
                )}
            </Text>
        </div>
    );

const MobileInfoIcon = ({ currency, is_virtual }: Partial<TMobileInfoIcon>) => (
    <span className='acc-info__id'>
        {(is_virtual || currency) && <AccountInfoIcon is_virtual={is_virtual} currency={currency?.toLowerCase()} />}
    </span>
);

const DesktopInfoIcons = observer(({ wallet_account, active_account, show_badge = false }: TDesktopInfoIcons) => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const theme = is_dark_mode_on ? 'dark' : 'light';

    return (
        <div className='acc-info__wallets-container'>
            <Icon
                icon={is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight'}
                size={24}
                data_testid='dt_ic_wallet_options'
            />
            <WalletIcon
                icon={wallet_account?.icons?.[theme] ?? ''}
                type={wallet_account?.icon_type}
                gradient_class={wallet_account?.gradients?.card[theme]}
                size={'small'}
                has_bg
                hide_watermark
            />
            <BalanceLabel
                balance={active_account?.balance}
                currency={active_account?.currency}
                is_virtual={Boolean(active_account?.is_virtual)}
                display_code={getCurrencyDisplayCode(active_account?.currency)}
            />
            {show_badge && (
                <WalletBadge
                    is_demo={Boolean(wallet_account?.is_virtual)}
                    label={wallet_account?.landing_company_name}
                />
            )}
        </div>
    );
});

const AccountInfoWallets = observer(({ is_dialog_on, toggleDialog }: TAccountInfoWallets) => {
    const { client, ui } = useStore();
    const { switchAccount, is_logged_in, loginid, accounts } = client;
    const { is_mobile, account_switcher_disabled_message, disableApp, enableApp } = ui;
    const { data: wallet_list } = useStoreWalletAccountsList();
    const linked_wallets_accounts = useStoreLinkedWalletsAccounts();

    const active_account = accounts?.[loginid ?? ''];
    const active_wallet = wallet_list?.find(wallet => wallet.loginid === loginid);

    let linked_dtrade_trading_account_loginid = loginid;

    if (active_wallet) {
        // get 'dtrade' loginid account linked to the current wallet
        linked_dtrade_trading_account_loginid =
            active_wallet.dtrade_loginid || linked_wallets_accounts.dtrade?.[0]?.loginid;

        // switch to dtrade account
        if (linked_dtrade_trading_account_loginid && linked_dtrade_trading_account_loginid !== loginid) {
            switchAccount(linked_dtrade_trading_account_loginid);
        }
    }

    const linked_wallet = wallet_list?.find(wallet => wallet.dtrade_loginid === linked_dtrade_trading_account_loginid);

    if (!linked_wallet) return <AccountsInfoLoader is_logged_in={is_logged_in} is_mobile={is_mobile} speed={3} />;

    return (
        <div className='acc-info__wrapper'>
            <div className='acc-info__separator' />
            <AccountInfoWrapper
                is_disabled={Boolean(active_account?.is_disabled)}
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
                    // SonarLint offers to add handler for onKeyDown event if we have onClick event handler
                    onKeyDown={active_account?.is_disabled ? undefined : () => toggleDialog()}
                >
                    {is_mobile ? (
                        <MobileInfoIcon
                            currency={active_account?.currency}
                            is_virtual={Boolean(active_account?.is_virtual)}
                        />
                    ) : (
                        <DesktopInfoIcons
                            wallet_account={linked_wallet}
                            active_account={active_account}
                            show_badge={linked_wallet.is_malta_wallet || linked_wallet.is_virtual}
                        />
                    )}
                    <DropdownArrow is_disabled={Boolean(active_account?.is_disabled)} />
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
                    <div className='acc-switcher__wrapper acc-switcher__wrapper--wallets'>
                        <AccountSwitcherWallet is_visible={is_dialog_on} toggle={toggleDialog} />
                    </div>
                </CSSTransition>
            )}
        </div>
    );
});

export default AccountInfoWallets;
