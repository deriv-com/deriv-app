import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { DesktopWrapper, Icon, MobileWrapper, WalletIcon, Badge } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { AccountSwitcher } from 'App/Containers/AccountSwitcher';
import AccountSwitcherMobile from 'App/Containers/AccountSwitcher/account-switcher-mobile';
import AccountInfoWrapper from './account-info-wrapper';
import AccountInfoIcon from './account-info-icon';
// import DisplayAccountType from './display-account-type';
import { useActiveAccount, useLinkedWalletsAccounts, useWalletAccountsList } from '@deriv/hooks';
// import TradingPlatformIcon from 'Assets/svgs/trading-platform';

type TAccountInfoWallets = {
    toggleDialog: () => void;
};

const AccountInfoWallets = observer(
    ({
        acc_switcher_disabled_message,
        account_type,
        // balance,
        // currency,
        country_standpoint,
        disableApp,
        enableApp,
        is_dialog_on,
        is_eu,
        // is_virtual,
        toggleDialog,
    }: // is_disabled,
    TAccountInfoWallets & any) => {
        const { client } = useStore();
        const { switchAccount } = client;

        // TODO: switch to dtrade account if CRW/MFW/VRW account is active
        const active_account = useActiveAccount();
        const { data: wallets_list } = useWalletAccountsList();
        const { data: linked_accounts } = useLinkedWalletsAccounts();

        if (active_account?.account_category === 'wallet') {
            // get 'dtrade' loginid account linked to the current wallet
            const linked_dtrade_trading_account_loginind =
                active_account?.linked_to?.find(account => account?.platform === 'dtrade')?.loginid ||
                linked_accounts.dtrade?.[0]?.loginid ||
                '';

            if (!linked_dtrade_trading_account_loginind) switchAccount(linked_dtrade_trading_account_loginind);
        }

        const currency_lower = active_account?.currency?.toLowerCase() || '';
        // const { currency, is_virtual, is_disabled, balance } = active_account;

        return (
            <div className='acc-info__wrapper'>
                <div className='acc-info__separator' />
                <AccountInfoWrapper
                    is_disabled={active_account?.is_disabled}
                    disabled_message={acc_switcher_disabled_message}
                >
                    <div
                        data-testid='dt_acc_info'
                        id='dt_core_account-info_acc-info'
                        className={classNames('acc-info', {
                            'acc-info--show': is_dialog_on,
                            'acc-info--is-virtual': active_account?.is_virtual,
                            'acc-info--is-disabled': active_account?.is_disabled,
                        })}
                        onClick={active_account?.is_disabled ? undefined : () => toggleDialog()}
                    >
                        <span className='acc-info__id'>
                            <DesktopWrapper>
                                {/* Wallet
                                <AccountInfoIcon is_virtual={active_account?.is_virtual} currency={currency_lower} /> */}

                                {/* <TradingPlatformIcon icon={'Options'} size={32} /> */}
                                <Icon icon={'IcWalletOptionsLight'} size={32} />
                                {/* <Icon icon={wallets_list?.[0]?.icon} size={32} /> */}

                                {/* 
                                gradient_class?: string;
                                icon: string;
                                size?: TWalletIconSizes;
                                type?: 'demo' | 'fiat' | 'crypto' | 'app';
                                has_bg?: boolean;
                                hide_watermark?: boolean; 
                                */}

                                <WalletIcon
                                    icon={wallets_list?.[0]?.icons.light}
                                    type={'fiat'}
                                    has_bg={true}
                                    // size='large'
                                />
                                <Badge type='bordered' label='SVG' />
                            </DesktopWrapper>
                            <MobileWrapper>
                                {(active_account?.is_virtual || active_account?.currency) && (
                                    <AccountInfoIcon
                                        is_virtual={active_account?.is_virtual}
                                        currency={currency_lower}
                                    />
                                )}
                            </MobileWrapper>
                        </span>
                        {(typeof active_account?.balance !== 'undefined' || !active_account?.currency) && (
                            <div className='acc-info__account-type-and-balance'>
                                <p
                                    data-testid='dt_balance'
                                    className={classNames('acc-info__balance', {
                                        'acc-info__balance--no-currency':
                                            !active_account?.currency && !active_account?.is_virtual,
                                    })}
                                >
                                    {!active_account?.currency ? (
                                        <Localize i18n_default_text='No currency assigned' />
                                    ) : (
                                        `${active_account?.balance} ${getCurrencyDisplayCode(active_account?.currency)}`
                                    )}
                                </p>
                                {/* <Text size='xxxs' line_height='s'>
                                    <DisplayAccountType
                                        account_type={account_type}
                                        country_standpoint={country_standpoint}
                                        is_eu={is_eu}
                                    />
                                </Text> */}
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
                <MobileWrapper>
                    <AccountSwitcherMobile
                        is_visible={is_dialog_on}
                        disableApp={disableApp}
                        enableApp={enableApp}
                        toggle={toggleDialog}
                    />
                </MobileWrapper>
                <DesktopWrapper>
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
                            <AccountSwitcher is_visible={is_dialog_on} toggle={toggleDialog} />
                        </div>
                    </CSSTransition>
                </DesktopWrapper>
            </div>
        );
    }
);

export default AccountInfoWallets;
