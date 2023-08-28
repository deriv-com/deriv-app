import React from 'react';
import classNames from 'classnames';
import { AppLinkedWithWalletIcon, Text, Badge } from '@deriv/components';
import { useActiveAccount, useWalletAccountsList } from '@deriv/hooks';
import { formatMoney } from '@deriv/shared';
import { localize } from '@deriv/translations';
import './account-switcher-wallet-item.scss';

type TAccountSwitcherWalletItemProps = {
    account: ReturnType<typeof useWalletAccountsList>['data'][number];
    closeAccountsDialog: () => void;
    is_dark_mode_on: boolean;
    switchAccount: (loginid?: string) => Promise<void>;
};

export const AccountSwitcherWalletItem = ({
    closeAccountsDialog,
    switchAccount,
    is_dark_mode_on,
    account,
}: TAccountSwitcherWalletItemProps) => {
    const {
        currency,
        currency_config,
        dtrade_loginid,
        dtrade_balance,
        gradients,
        icons,
        is_active,
        is_virtual,
        landing_company_name,
        linked_to,
    } = account;
    const active_account = useActiveAccount();

    const theme = is_dark_mode_on ? 'dark' : 'light';
    const appIcon = is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';
    const icon_type = is_virtual ? 'demo' : currency_config?.type;
    const is_selected = is_active || linked_to?.some(account => account.loginid === active_account?.loginid);

    const onAccountSwitch = async () => {
        closeAccountsDialog();
        if (is_selected) return;
        await switchAccount(dtrade_loginid);
    };

    return (
        <div
            className={classNames('acc-switcher-wallet-item__container', {
                'acc-switcher-wallet-item__container--active': is_selected,
            })}
            data-testid='account-switcher-wallet-item'
            onClick={onAccountSwitch}
        >
            <div>
                <AppLinkedWithWalletIcon
                    app_icon={appIcon}
                    gradient_class={gradients.card[theme]}
                    type={icon_type}
                    wallet_icon={icons[theme]}
                    hide_watermark
                />
            </div>
            <div className='acc-switcher-wallet-item__content'>
                <Text size='xxs'>{currency_config?.name}</Text>
                <Text size='xs' weight='bold'>
                    {`${formatMoney(currency || '', dtrade_balance || 0, true)} ${currency_config?.display_code}`}
                </Text>
            </div>
            {is_virtual ? (
                <Badge type='contained' background_color='blue' label={localize('Demo')} />
            ) : (
                <Badge type='bordered' label={landing_company_name?.toUpperCase() || ''} />
            )}
        </div>
    );
};
