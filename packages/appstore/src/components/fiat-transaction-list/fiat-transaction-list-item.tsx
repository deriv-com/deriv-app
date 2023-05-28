import React, { useCallback } from 'react';
import { Statement } from '@deriv/api-types';
import { isMobile } from '@deriv/shared';
import { Text, WalletCard } from '@deriv/components';

type StatementTransaction = DeepRequired<Statement>['transactions'][number];

type TFiatTransactionListItem = Pick<StatementTransaction, 'amount' | 'balance_after'> & {
    action_type:
        | (StatementTransaction['action_type'] & ('deposit' | 'withdrawal' | 'transfer'))
        | 'initial_fund'
        | 'reset_balance';
    account_name: string;
    currency: string;
    icon: string;
    icon_type: string;
};

const FiatTransactionListItem = ({
    account_name,
    action_type,
    amount,
    balance_after,
    currency,
    icon,
    icon_type,
}: TFiatTransactionListItem) => {
    const formatAmount = useCallback(
        (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2 }),
        []
    );

    const formatActionType = useCallback(
        (value: string) => value[0].toUpperCase() + value.substring(1).replace(/_/, ' '),
        []
    );

    return (
        <div className='fiat-transaction-list__item'>
            <div>
                <WalletCard
                    wallet={{
                        currency,
                        icon,
                        icon_type,
                    }}
                    size='small'
                />
                <span>
                    <Text
                        size={isMobile() ? 'xxxs' : 'xxs'}
                        color='less-prominent'
                        weight='lighter'
                        line_height={isMobile() ? 's' : 'm'}
                    >
                        {formatActionType(action_type)}
                    </Text>
                    <Text
                        size={isMobile() ? 'xxxs' : 'xxs'}
                        color='prominent'
                        weight='bold'
                        line_height={isMobile() ? 's' : 'm'}
                    >
                        {account_name}
                    </Text>
                </span>
            </div>
            <span>
                <Text
                    size={isMobile() ? 'xxxs' : 'xxs'}
                    color={amount > 0 ? 'profit-success' : 'loss-danger'}
                    weight='bold'
                    line_height={isMobile() ? 's' : 'm'}
                >
                    {(amount > 0 ? '+' : '') + formatAmount(amount)} {currency}
                </Text>
                <Text
                    size={isMobile() ? 'xxxxs' : 'xxxs'}
                    color='less-prominent'
                    weight='lighter'
                    line_height={isMobile() ? 'm' : 's'}
                >
                    Balance: {formatAmount(balance_after)} {currency}
                </Text>
            </span>
        </div>
    );
};

export default FiatTransactionListItem;
