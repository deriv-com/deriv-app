import React from 'react';
import classNames from 'classnames';
import { AppLinkedWithWalletIcon, Text } from '@deriv/components';
import { formatMoney, getCurrencyDisplayCode } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useStoreWalletAccountsList } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import WalletBadge from 'App/Components/Layout/Header/wallets/wallet-badge';
import './account-switcher-wallet-item.scss';

type TAccountSwitcherWalletItemProps = {
    account: ReturnType<typeof useStoreWalletAccountsList>['data'][number];
    closeAccountsDialog: () => void;
    show_badge?: boolean;
};

export const AccountSwitcherWalletItem = observer(
    ({ closeAccountsDialog, account, show_badge = false }: TAccountSwitcherWalletItemProps) => {
        const {
            currency,
            dtrade_loginid,
            dtrade_balance,
            gradients,
            icons,
            is_virtual,
            landing_company_name,
            linked_to,
            icon_type,
            loginid,
        } = account;

        const {
            ui: { is_dark_mode_on },
            client: { switchAccount, loginid: active_loginid },
        } = useStore();

        const theme = is_dark_mode_on ? 'dark' : 'light';
        const app_icon = is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';
        const is_active = loginid === active_loginid;
        const is_selected = is_active || linked_to?.some(account => account.loginid === active_loginid);

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
                // SonarLint offers to add handler for onKeyDown event if we have onClick event handler
                onKeyDown={onAccountSwitch}
            >
                <div>
                    <AppLinkedWithWalletIcon
                        app_icon={app_icon}
                        gradient_class={gradients?.card[theme] ?? ''}
                        type={icon_type}
                        wallet_icon={icons?.[theme] ?? ''}
                        hide_watermark
                    />
                </div>
                <div className='acc-switcher-wallet-item__content'>
                    <Text size='xxxs'>
                        <Localize i18n_default_text='Deriv Apps' />
                    </Text>
                    <Text size='xxxs'>
                        {is_virtual ? (
                            <Localize i18n_default_text='Demo Wallet' />
                        ) : (
                            <Localize
                                i18n_default_text='{{currency}} Wallet'
                                values={{ currency: getCurrencyDisplayCode(currency) }}
                            />
                        )}
                    </Text>
                    <Text size='xs' weight='bold'>
                        {`${formatMoney(currency || '', dtrade_balance || 0, true)} ${getCurrencyDisplayCode(
                            currency
                        )}`}
                    </Text>
                </div>
                {show_badge && <WalletBadge is_demo={Boolean(is_virtual)} label={landing_company_name} />}
            </div>
        );
    }
);
