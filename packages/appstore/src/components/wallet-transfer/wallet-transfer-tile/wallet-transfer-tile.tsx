import React from 'react';
import classNames from 'classnames';
import { Text, AppLinkedWithWalletIcon, WalletIcon } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { Localize } from '@deriv/translations';
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
    is_list_item?: boolean;
    is_mobile?: boolean;
    onClick?: () => void;
};

const IconComponent = ({ account, icon_size }: TWalletTileProps) => {
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
            gradient_class={account?.gradient_class ?? ''}
            size={icon_size as React.ComponentProps<typeof AppLinkedWithWalletIcon>['size']}
            type={account?.type}
            wallet_icon={account?.active_wallet_icon}
        />
    ) : null;
};

const Balance = ({ account, is_list_item, is_mobile }: TWalletTileProps) => {
    if (account?.balance !== undefined) {
        let size;
        if (is_list_item) size = is_mobile ? 'xxxs' : 'xxs';
        else size = is_mobile ? 'xxxxs' : 'xxxs';

        return (
            <Text as='div' size={size}>
                <Localize
                    i18n_default_text='Balance: {{balance}} {{currency}}'
                    values={{
                        balance: formatMoney(account?.currency ?? '', account.balance, true),
                        currency: account.display_currency_code,
                    }}
                />
            </Text>
        );
    }

    return null;
};

const Label = ({ account, is_list_item, is_mobile }: TWalletTileProps) => {
    let size;
    if (is_list_item) size = is_mobile ? 'xxs' : 'xs';
    else size = is_mobile ? 'xxxxs' : 'xxxs';

    return (
        <Text as='div' size={size} weight='bold'>
            {getAccountName({ ...account })}
        </Text>
    );
};

const WalletTransferTile = ({
    account,
    className,
    has_hover,
    icon_size = 'small',
    is_active,
    is_list_item,
    is_mobile,
    onClick,
}: TWalletTileProps) => {
    return (
        <div
            className={classNames(`wallet-transfer-tile ${className}`, {
                'wallet-transfer-tile--hover': has_hover,
                'wallet-transfer-tile--active': is_active,
                'wallet-transfer-tile--list-item-background': is_list_item && !is_active,
            })}
            data-testid='dt_wallet_transfer_tile'
            onClick={() => onClick?.()}
        >
            <div className='wallet-transfer-tile__icon-with-badge'>
                <div className='wallet-transfer-tile__icon'>
                    <IconComponent account={account} icon_size={icon_size} />
                </div>

                {!is_list_item && is_mobile && (
                    <WalletJurisdictionBadge is_demo={!!account?.is_demo} shortcode={account?.shortcode} />
                )}
            </div>

            <div className='wallet-transfer-tile__content'>
                <Label account={account} is_list_item={is_list_item} is_mobile={is_mobile} />
                <Balance account={account} is_list_item={is_list_item} is_mobile={is_mobile} />
            </div>

            {is_list_item && <WalletJurisdictionBadge is_demo={!!account?.is_demo} shortcode={account?.shortcode} />}
        </div>
    );
};

export default React.memo(WalletTransferTile);
