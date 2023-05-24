import React from 'react';
import { Statement } from '@deriv/api-types';
import { isMobile } from '@deriv/shared';
import { Text, WalletCard } from '@deriv/components';

type StatementTransaction = DeepRequired<Statement>['transactions'][0];

type TFiatTransactionListItem = Pick<StatementTransaction, 'amount' | 'balance_after'> & {
    action_type:
        | (StatementTransaction['action_type'] & ('deposit' | 'withdrawal' | 'transfer'))
        | 'initial_fund'
        | 'reset_balance';
    account_name: string;
    currency: string;
    wallet: any;
};

const FiatTransactionListItem = ({
    account_name,
    action_type,
    amount,
    balance_after,
    currency,
    wallet,
}: TFiatTransactionListItem) => {
    return (
        <div className='fiat-transaction-list-item'>
            <div>
                <WalletCard wallet={wallet} size='small' />
                <span>
                    <Text
                        size={isMobile() ? 'xxs' : 's'}
                        color='less-prominent'
                        weight='lighter'
                        line_height={isMobile() ? 'xs' : 'xs'}
                    >
                        {action_type[0].toUpperCase() + action_type.substring(1).replace(/_/, ' ')}
                    </Text>
                    <Text
                        size={isMobile() ? 'xxs' : 's'}
                        color='prominent'
                        weight='bold'
                        line_height={isMobile() ? 'xs' : 'xs'}
                    >
                        {account_name}
                    </Text>
                </span>
            </div>
            <span>
                <Text
                    size={isMobile() ? 'xxs' : 's'}
                    color={amount > 0 ? 'profit-success' : 'loss-danger'}
                    weight='bold'
                    line_height={isMobile() ? 'xxs' : 'xs'}
                >
                    {(amount > 0 ? '+' : '') + amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
                    {currency}
                </Text>
                <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' weight='lighter' line_height='xxs'>
                    Balance: {balance_after.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                </Text>
            </span>
        </div>
    );
};

export default FiatTransactionListItem;
