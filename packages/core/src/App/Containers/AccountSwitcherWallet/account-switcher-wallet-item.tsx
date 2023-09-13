import React from 'react';
import classNames from 'classnames';
import { AppLinkedWithWalletIcon, Text } from '@deriv/components';
import { useActiveAccount, useWalletAccountsList } from '@deriv/hooks';
import { formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import WalletBadge from 'App/Components/Layout/Header/wallets/wallet-badge';
import { Localize } from '@deriv/translations';
import './account-switcher-wallet-item.scss';

type TAccountSwitcherWalletItemProps = {
    account: ReturnType<typeof useWalletAccountsList>['data'][number];
    closeAccountsDialog: () => void;
};

export const AccountSwitcherWalletItem = observer(
    ({ closeAccountsDialog, account }: TAccountSwitcherWalletItemProps) => {
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
            is_malta_wallet,
        } = account;

        const {
            ui: { is_dark_mode_on },
            client: { switchAccount },
        } = useStore();

        const active_account = useActiveAccount();

        const theme = is_dark_mode_on ? 'dark' : 'light';
        const app_icon = is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';
        const icon_type = is_virtual ? 'demo' : currency_config?.type;
        const is_selected = is_active || linked_to?.some(account => account.loginid === active_account?.loginid);

        const show_badge = is_malta_wallet || is_virtual;

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
                        app_icon={app_icon}
                        gradient_class={gradients.card[theme]}
                        type={icon_type}
                        wallet_icon={icons[theme]}
                        hide_watermark
                    />
                </div>
                <div className='acc-switcher-wallet-item__content'>
                    <Text size='xxxs'>
                        <Localize i18n_default_text='Deriv Apps' />
                    </Text>
                    <Text size='xxxs'>
                        <Localize
                            i18n_default_text='{{currency}} Wallet'
                            values={{ currency: currency_config?.display_code }}
                        />
                    </Text>
                    <Text size='xs' weight='bold'>
                        {`${formatMoney(currency || '', dtrade_balance || 0, true)} ${currency_config?.display_code}`}
                    </Text>
                </div>
                {show_badge && <WalletBadge is_demo={is_virtual} label={landing_company_name} />}
            </div>
        );
    }
);
