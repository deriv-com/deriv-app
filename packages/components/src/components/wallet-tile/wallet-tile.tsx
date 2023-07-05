import React from 'react';
import classNames from 'classnames';
import Text from '../text';
import { getCurrencyDisplayCode, formatMoney } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { getAccountName } from '@deriv/utils';
import { AppLinkedWithWalletIcon } from '../app-linked-with-wallet-icon';
import { WalletJurisdictionBadge } from '../wallet-jurisdiction-badge';
import { WalletIcon } from '../wallet-icon';
import './wallet-tile.scss';

type TAccount = {
    account_type: 'wallet' | 'trading' | 'dxtrade' | 'mt5' | 'derivez' | 'binary' | undefined;
    balance: number;
    currency: string;
    gradient_class: string;
    is_demo: boolean;
    loginid: string;
    shortcode: string | undefined;
    type: 'fiat' | 'crypto';
    wallet_icon: string | undefined;
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
    const account_name = getAccountName(
        account?.account_type,
        Boolean(account?.is_demo),
        getCurrencyDisplayCode(account?.currency)
    );

    const account_icon = account?.account_type === 'wallet' ? '' : 'IcWalletOptionsLight';

    const IconComponent = React.useCallback(() => {
        if (account_icon && account?.wallet_icon) {
            return (
                <AppLinkedWithWalletIcon
                    app_icon={account_icon}
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
    }, [account?.gradient_class, account?.type, account?.wallet_icon, account_icon, icon_size]);

    const Label = React.useCallback(() => {
        if (account_name) {
            let size;
            if (is_value) size = is_mobile ? 'xxxxs' : 'xxxs';
            else size = is_mobile ? 'xxs' : 'xs';

            return (
                <Text as='div' size={size} weight='bold'>
                    {localize('{{ account_name }}', { account_name })}
                </Text>
            );
        }

        return null;
    }, [account_name, is_mobile, is_value]);

    const Balance = React.useCallback(() => {
        if (account?.balance) {
            let size;
            if (is_value) size = is_mobile ? 'xxxxs' : 'xxxs';
            else size = is_mobile ? 'xxxs' : 'xxs';

            return (
                <Text as='div' size={size}>
                    {localize('Balance')}: {formatMoney(account.currency, account.balance, true)}{' '}
                    {getCurrencyDisplayCode(account.currency)}
                </Text>
            );
        }

        return null;
    }, [account?.balance, account?.currency, is_mobile, is_value]);

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

                {is_value && is_mobile && (
                    <WalletJurisdictionBadge is_demo={Boolean(account?.is_demo)} shortcode={account?.shortcode} />
                )}
            </div>

            <div className='wallet-tile__content'>
                <Label />
                <Balance />
            </div>

            {!is_value && (
                <WalletJurisdictionBadge is_demo={Boolean(account?.is_demo)} shortcode={account?.shortcode} />
            )}
        </div>
    );
};

export default React.memo(WalletTile);
