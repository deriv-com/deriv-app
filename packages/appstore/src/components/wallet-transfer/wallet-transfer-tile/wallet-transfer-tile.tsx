import React from 'react';
import classNames from 'classnames';
import { Text, AppLinkedWithWalletIcon, WalletIcon } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { getAccountName } from 'Constants/utils';
import { WalletJurisdictionBadge } from 'Components/wallet-jurisdiction-badge';
import type { TTransferAccount } from 'Types';
import './wallet-transfer-tile.scss';

type TIconSize =
    | React.ComponentProps<typeof AppLinkedWithWalletIcon>['size']
    | React.ComponentProps<typeof WalletIcon>['size'];

type TWalletTileProps = {
    account?: TTransferAccount;
    className?: string;
    has_hover?: boolean;
    icon_size?: TIconSize;
    is_active?: boolean;
    is_mobile?: boolean;
    is_value?: boolean;
    onClick?: () => void;
};

const WalletTransferTile = ({
    account,
    className,
    has_hover,
    icon_size = 'small',
    is_active,
    is_mobile,
    is_value,
    onClick,
}: TWalletTileProps) => {
    const IconComponent = React.useCallback(() => {
        if (account?.account_type === 'wallet') {
            return account?.icon ? (
                <WalletIcon
                    gradient_class={account?.gradient_class}
                    icon={account?.icon}
                    size={icon_size as React.ComponentProps<typeof WalletIcon>['size']}
                    type={account?.type}
                />
            ) : null;
        }

        return account?.icon && account?.active_wallet_icon ? (
            <AppLinkedWithWalletIcon
                app_icon={account?.icon}
                gradient_class={account?.gradient_class || ''}
                size={icon_size as React.ComponentProps<typeof AppLinkedWithWalletIcon>['size']}
                type={account?.type}
                wallet_icon={account?.active_wallet_icon}
            />
        ) : null;
    }, [
        account?.account_type,
        account?.active_wallet_icon,
        account?.gradient_class,
        account?.icon,
        account?.type,
        icon_size,
    ]);

    const Label = React.useCallback(() => {
        let size;
        if (is_value) size = is_mobile ? 'xxxxs' : 'xxxs';
        else size = is_mobile ? 'xxs' : 'xs';

        return (
            <Text as='div' size={size} weight='bold'>
                {getAccountName({ ...account })}
            </Text>
        );
    }, [account, is_mobile, is_value]);

    const Balance = React.useCallback(() => {
        if (account?.balance !== undefined) {
            let size;
            if (is_value) size = is_mobile ? 'xxxxs' : 'xxxs';
            else size = is_mobile ? 'xxxs' : 'xxs';

            return (
                <Text as='div' size={size}>
                    {localize('Balance')}: {formatMoney(account.currency, account.balance, true)}{' '}
                    {account.display_currency_code}
                </Text>
            );
        }

        return null;
    }, [account?.balance, account?.currency, account?.display_currency_code, is_mobile, is_value]);

    return (
        <div
            className={classNames(`wallet-transfer-tile ${className}`, {
                'wallet-transfer-tile--hover': has_hover,
                'wallet-transfer-tile--active': is_active,
            })}
            data-testid='dt_wallet_transfer_tile'
            onClick={() => onClick?.()}
        >
            <div className='wwallet-transfer-tile__icon-with-badge'>
                <div className='wallet-transfer-tile__icon'>
                    <IconComponent />
                </div>

                {is_value && is_mobile && (
                    <WalletJurisdictionBadge is_demo={Boolean(account?.is_demo)} shortcode={account?.shortcode} />
                )}
            </div>

            <div className='wallet-transfer-tile__content'>
                <Label />
                <Balance />
            </div>

            {!is_value && (
                <WalletJurisdictionBadge is_demo={Boolean(account?.is_demo)} shortcode={account?.shortcode} />
            )}
        </div>
    );
};

export default React.memo(WalletTransferTile);
