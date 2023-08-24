import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useStore } from '@deriv/stores';
import { AppLinkedWithWalletIcon, Text, Badge } from '@deriv/components';
import { useWalletAccountsList } from '@deriv/hooks';
import { localize } from '@deriv/translations';
import './account-switcher-wallet-item.scss';

type TAccountSwitcherWalletItemProps = ReturnType<typeof useWalletAccountsList>['data'][number];

export const AccountSwitcherWalletItem = ({
    currency_config,
    is_virtual,
    is_active,
    balance,
    currency,
    icons,
    gradients,
    landing_company_name,
}: TAccountSwitcherWalletItemProps) => {
    const {
        ui: { is_dark_mode_on },
    } = useStore();

    const theme = is_dark_mode_on ? 'dark' : 'light';
    const appIcon = is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';

    const icon_type = useMemo(() => (is_virtual ? 'demo' : currency_config?.type), [is_virtual, currency_config]);

    return (
        <div
            className={classNames('acc-switcher-wallet-item__container', {
                'acc-switcher-wallet-item__container--active': is_active,
            })}
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
                    {`${balance} ${currency}`}
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
