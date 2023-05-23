import React from 'react';
import { Statement } from '@deriv/api-types';
import { Text } from '@deriv/components';
import WalletCurrencyCard from '../wallet-header/wallet-currency-card';
import { TAccountCategory, TWalletCurrency } from 'Types';

type StatementTransaction = DeepRequired<Statement>['transactions'][0];

type TFiatTransactionListItem = Pick<StatementTransaction, 'amount' | 'balance_after'> & {
    action_type:
        | (StatementTransaction['action_type'] & ('deposit' | 'withdrawal' | 'transfer'))
        | 'initial_fund'
        | 'reset_balance';
    account_name: string;
    account_type: TAccountCategory;
    currency: TWalletCurrency;
};

const FiatTransactionListItem = ({
    account_name,
    account_type,
    action_type,
    amount,
    balance_after,
    currency,
}: TFiatTransactionListItem) => {
    return (
        <div className='fiat-transaction-list-item'>
            <div>
                <WalletCurrencyCard account_type={account_type} currency={currency} />
                <span>
                    <Text size='s' color='less-prominent' weight='lighter' line_height='xs'>
                        {action_type[0].toUpperCase() + action_type.substring(1).replace(/_/, ' ')}
                    </Text>
                    <Text size='s' color='prominent' weight='bold' line_height='xs'>
                        {account_name}
                    </Text>
                </span>
            </div>
            <span>
                <Text size='s' color={amount > 0 ? 'status-success' : 'status-danger'} weight='bold' line_height='xs'>
                    {(amount > 0 ? '+' : '') + amount.toLocaleString()} {currency}
                </Text>
                <Text size='xs' color='less-prominent' weight='lighter' line_height='xxs'>
                    Balance: {balance_after.toLocaleString()} {currency}
                </Text>
            </span>
        </div>
    );
};

export default FiatTransactionListItem;
