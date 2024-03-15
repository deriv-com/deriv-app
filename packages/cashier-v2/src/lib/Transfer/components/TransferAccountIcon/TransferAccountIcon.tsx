import React from 'react';
import { CurrencyIcon, TradingAppIcon } from '../../../../components';
import { getMarketType } from '../../../../helpers';
import { TTransferableAccounts } from '../../types';

type TProps = {
    account: TTransferableAccounts[number];
    size?: React.ComponentProps<typeof CurrencyIcon>['size'] | React.ComponentProps<typeof TradingAppIcon>['size'];
};

const TransferAccountIcon: React.FC<React.PropsWithChildren<TProps>> = ({ account, size = 'md' }) => {
    if (account.account_type === 'binary' && account.currency)
        return <CurrencyIcon currency={account.currency} size={size} />;

    if (account.account_type === 'dxtrade') return <TradingAppIcon name='DERIVX' size={size} />;

    if (account.account_type === 'mt5')
        return (
            <TradingAppIcon
                name={`D${account.account_type.toUpperCase()}_${getMarketType(account.mt5_group).toUpperCase()}`}
                size={size}
            />
        );

    return null;
};

export default TransferAccountIcon;
