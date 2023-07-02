import React from 'react';
import classNames from 'classnames';
import Text from '../text';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { AppLinkedWithWalletIcon } from '../app-linked-with-wallet-icon';
import { WalletIcon } from '../wallet-icon';
import './wallet-tile.scss';

type TAccount = {
    account_type: 'wallet' | 'trading' | 'dxtrade' | 'mt5' | 'derivez' | 'binary' | undefined;
    balance: number;
    currency: string;
    display_balance: string;
    gradient_class: string;
    icon: string;
    is_demo: 0 | 1 | undefined;
    jurisdiction: JSX.Element;
    label: string;
    loginid: string;
    type: 'fiat' | 'crypto';
    wallet_icon: string;
};

type TIconSize =
    | React.ComponentProps<typeof AppLinkedWithWalletIcon>['size']
    | React.ComponentProps<typeof WalletIcon>['size'];

type TWalletTileProps = {
    account?: TAccount;
    className?: string;
    has_hover?: boolean;
    icon_size?: TIconSize;
    is_active?: boolean;
    is_mobile?: boolean;
    is_value?: boolean;
    onClick?: () => void;
};

const WalletTile = ({
    account,
    className,
    has_hover,
    icon_size = 'small',
    is_active,
    is_mobile,
    is_value,
    onClick,
}: TWalletTileProps) => {
    const IconComponent = () => {
        if (account?.icon && account.wallet_icon) {
            return (
                <AppLinkedWithWalletIcon
                    app_icon={account.icon}
                    gradient_class={account.gradient_class}
                    size={icon_size as React.ComponentProps<typeof AppLinkedWithWalletIcon>['size']}
                    type={account.type}
                    wallet_icon={account.wallet_icon}
                />
            );
        } else if (account?.wallet_icon) {
            return (
                <WalletIcon
                    gradient_class={account.gradient_class}
                    icon={account.wallet_icon}
                    size={icon_size as React.ComponentProps<typeof WalletIcon>['size']}
                    type={account.type}
                />
            );
        }

        return null;
    };

    const Label = () => {
        if (account?.label) {
            let size;
            if (is_value) size = is_mobile ? 'xxxxs' : 'xxxs';
            else size = is_mobile ? 'xxs' : 'xs';

            return (
                <Text as='div' size={size} weight='bold'>
                    {account.label}
                </Text>
            );
        }

        return null;
    };

    const Balance = () => {
        if (account?.balance) {
            let size;
            if (is_value) size = is_mobile ? 'xxxxs' : 'xxxs';
            else size = is_mobile ? 'xxxs' : 'xxs';

            return (
                <Text as='div' size={size}>
                    {localize('Balance')}: {account.display_balance} {getCurrencyDisplayCode(account.currency)}
                </Text>
            );
        }

        return null;
    };

    return (
        <div
            className={classNames(`wallet-tile ${className}`, {
                'wallet-tile--hover': has_hover,
                'wallet-tile--active': is_active,
            })}
            data-testid='dt_wallet_tile'
            onClick={() => onClick?.()}
        >
            <div className='wallet-tile__icon-with-badge'>
                <div className='wallet-tile__icon'>
                    <IconComponent />
                </div>

                {is_value && is_mobile && account?.jurisdiction}
            </div>

            <div className='wallet-tile__content'>
                <Label />
                <Balance />
            </div>

            {!is_value && account?.jurisdiction}
        </div>
    );
};

export default React.memo(WalletTile);
