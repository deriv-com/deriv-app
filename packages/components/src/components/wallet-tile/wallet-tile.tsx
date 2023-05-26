import React from 'react';
import classNames from 'classnames';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { localize } from '@deriv/translations';
import './wallet-tile.scss';
import { AppLinkedWithWalletIcon } from '../app-linked-with-wallet-icon';
import { WalletIcon } from '../wallet-icon';
import Text from '../text';

type TAccount = {
    balance?: string;
    currency: string;
    icon?: string;
    jurisdiction?: string;
    label?: string;
    loginid: string;
    type: 'fiat' | 'crypto';
    wallet_icon?: string;
    wallet_name?: string;
};

type TIconSize =
    | React.ComponentProps<typeof AppLinkedWithWalletIcon>['size']
    | React.ComponentProps<typeof WalletIcon>['size'];

type TWalletTileProps = {
    account: TAccount;
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
        if (account.icon && account.wallet_icon) {
            return (
                <AppLinkedWithWalletIcon
                    app_icon={account.icon}
                    currency={account.currency}
                    size={icon_size as React.ComponentProps<typeof AppLinkedWithWalletIcon>['size']}
                    type={account.type}
                    wallet_icon={account.wallet_icon}
                />
            );
        } else if (account.wallet_icon) {
            return (
                <WalletIcon
                    currency={account.currency}
                    icon={account.wallet_icon}
                    size={icon_size as React.ComponentProps<typeof WalletIcon>['size']}
                    type={account.type}
                />
            );
        }

        return null;
    };

    const Label = () => {
        if (account.label) {
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
        if (account.balance) {
            let size;
            if (is_value) size = is_mobile ? 'xxxxs' : 'xxxs';
            else size = is_mobile ? 'xxxs' : 'xxs';

            return (
                <Text size={size}>
                    {localize('Balance')}: {account.balance} {getCurrencyDisplayCode(account.currency)}
                </Text>
            );
        }

        return null;
    };

    const JurisdictionBadge = () => {
        if (account.jurisdiction) {
            return (
                <Text size={is_mobile ? 'xxxxs' : 'xxxs'} weight='bold' className='wallet-tile__jurisdiction'>
                    {account.jurisdiction}
                </Text>
            );
        }

        return null;
    };

    if (is_mobile) {
        return (
            <div
                className={classNames(`wallet-tile wallet-tile--mobile ${className}`, {
                    'wallet-tile--hover': has_hover,
                    'wallet-tile--active': is_active,
                })}
                onClick={() => onClick?.()}
            >
                <div className='wallet-tile__header'>
                    <div className='wallet-tile__icon'>
                        <IconComponent />
                    </div>
                    <JurisdictionBadge />
                </div>

                <Label />
                <Balance />
            </div>
        );
    }

    return (
        <div
            className={classNames(`wallet-tile ${className}`, {
                'wallet-tile--hover': has_hover,
                'wallet-tile--active': is_active,
            })}
            onClick={() => onClick?.()}
        >
            <div className='wallet-tile__icon'>
                <IconComponent />
            </div>

            <div className='wallet-tile__content'>
                <div>
                    <Label />
                    <Balance />
                </div>

                <JurisdictionBadge />
            </div>
        </div>
    );
};

export default WalletTile;
