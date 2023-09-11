import React from 'react';
import { Button, Text } from '@deriv/components';
import { useWalletAccountsList } from '@deriv/hooks';
import { formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { LinkedIconBadge } from './linked-icon-badge';
import './account-switcher-selected-wallet-mobile.scss';

type TAccountSwitcherSelectedWalletMobile = {
    selected_account?: ReturnType<typeof useWalletAccountsList>['data'][number];
};

export const AccountSwitcherSelectedWalletMobile = observer(
    ({ selected_account }: TAccountSwitcherSelectedWalletMobile) => {
        const {
            ui: { is_dark_mode_on },
        } = useStore();

        if (!selected_account) return null;

        const {
            currency_config,
            is_virtual,
            gradients: { card },
            icons,
            landing_company_name,
            currency,
            dtrade_balance,
        } = selected_account;

        const theme = is_dark_mode_on ? 'dark' : 'light';
        const appIcon = is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';
        const icon_type = is_virtual ? 'demo' : currency_config?.type;

        return (
            <div className='account-switcher-wallet-mobile__selected-wallet'>
                <LinkedIconBadge
                    is_virtual={is_virtual}
                    app_icon={appIcon}
                    gradient_class={card[theme]}
                    type={icon_type}
                    wallet_icon={icons[theme]}
                    label={landing_company_name}
                />
                <div className='account-switcher-wallet-mobile__selected-wallet__content'>
                    <Text size='s' weight='bold'>
                        {currency_config?.name}
                    </Text>
                    <Text size='s' weight='bold' color={is_virtual ? 'info-blue' : 'profit-success'}>
                        {`${formatMoney(currency || '', dtrade_balance || 0, true)} ${currency_config?.display_code}`}
                    </Text>
                </div>
                <Button className='account-switcher-wallet-mobile__selected-wallet__button' primary large>
                    <Localize i18n_default_text='Manage funds' />
                </Button>
            </div>
        );
    }
);
