import React from 'react';
import { Statement } from '@deriv/api-types';
import { Text } from '@deriv/components';

type StatementTransaction = DeepRequired<Statement>['transactions'][0];

type TFiatTransactionListItem = Pick<StatementTransaction, 'amount' | 'balance_after'> & {
    action_type:
        | (StatementTransaction['action_type'] & ('deposit' | 'withdrawal' | 'transfer'))
        | 'initial_fund'
        | 'reset_balance';
    account: {
        icon: React.ReactNode; // TODO: icons
        name: string;
    };
    currency: string;
};

const FiatTransactionListItem = ({
    account,
    action_type,
    amount,
    balance_after,
    currency,
}: TFiatTransactionListItem) => {
    return (
        <div className='fiat-transaction-list-item'>
            <div>
                {account.icon}
                <span>
                    <Text size='s' color='less-prominent' line_height={'l' /* TODO clarify for all line_height='l' */}>
                        {action_type[0].toUpperCase() + action_type.substring(1).replace(/_/, ' ')}
                    </Text>
                    <Text size='s' color='prominent' weight='bold' line_height='l'>
                        {account.name}
                    </Text>
                </span>
            </div>
            <span>
                <Text size='s' color={amount > 0 ? 'status-success' : 'status-danger'} weight='bold' line_height='l'>
                    {amount /* TODO formatting */} {currency}
                </Text>
                <Text size='xs' color='less-prominent' line_height='s'>
                    Balance: {balance_after /* TODO formatting */} {currency}
                </Text>
            </span>
        </div>
    );
};

export default FiatTransactionListItem;
