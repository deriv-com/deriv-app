import React from 'react';
import { Statement } from '@deriv/api-types';
import { useStore } from '@deriv/stores';
import { AppLinkedWithWalletIcon, Text, WalletIcon } from '@deriv/components';

type TStatementTransaction = DeepRequired<Statement>['transactions'][number];

type TFiatTransactionListItem = Pick<TStatementTransaction, 'amount' | 'balance_after'> & {
    action_type:
        | (TStatementTransaction['action_type'] & ('deposit' | 'withdrawal' | 'transfer'))
        | 'initial_fund'
        | 'reset_balance';
    account_currency: string;
    account_name: string;
    currency: string;
    icon: string;
    icon_type: string;
    platform?: string | null;
};

const FiatTransactionListItem = ({
    account_currency,
    account_name,
    action_type,
    amount,
    balance_after,
    currency,
    icon,
    icon_type,
    platform,
}: TFiatTransactionListItem) => {
    const {
        ui: { is_mobile },
    } = useStore();
    const formatAmount = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2 });

    const formatActionType = (value: string) => value[0].toUpperCase() + value.substring(1).replace(/_/, ' ');

    return (
        <div className='fiat-transaction-list__item'>
            <div>
                {platform ? (
                    <AppLinkedWithWalletIcon
                        app_icon={platform}
                        currency={account_currency}
                        type={icon_type}
                        wallet_icon={icon}
                    />
                ) : (
                    <WalletIcon currency={account_currency} icon={icon} type={icon_type} has_bg size='medium' />
                )}
                <span>
                    <Text
                        size={is_mobile ? 'xxxs' : 'xxs'}
                        color='less-prominent'
                        weight='lighter'
                        line_height={is_mobile ? 's' : 'm'}
                    >
                        {formatActionType(action_type)}
                    </Text>
                    <Text
                        size={is_mobile ? 'xxxs' : 'xxs'}
                        color='prominent'
                        weight='bold'
                        line_height={is_mobile ? 's' : 'm'}
                    >
                        {account_name}
                    </Text>
                </span>
            </div>
            <span>
                <Text
                    size={is_mobile ? 'xxxs' : 'xxs'}
                    color={amount > 0 ? 'profit-success' : 'loss-danger'}
                    weight='bold'
                    line_height={is_mobile ? 's' : 'm'}
                >
                    {(amount > 0 ? '+' : '') + formatAmount(amount)} {currency}
                </Text>
                <Text
                    size={is_mobile ? 'xxxxs' : 'xxxs'}
                    color='less-prominent'
                    weight='lighter'
                    line_height={is_mobile ? 'm' : 's'}
                >
                    Balance: {formatAmount(balance_after)} {currency}
                </Text>
            </span>
        </div>
    );
};

export default FiatTransactionListItem;
