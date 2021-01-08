import classNames from 'classnames';
import * as React from 'react';
import { Transaction } from '@deriv/api-types';
import { Icon, Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getFormattedText } from '@deriv/shared';

const TransactionsTransaction: React.FC<TTransactionsTransaction> = ({ transaction }) => {
    return (
        <div key={transaction.id} className='dw-transactions__transaction'>
            <div className='dw-transactions__transaction-left'>
                <Icon className='dw-transactions__transaction-icon' icon='IcUnknown' height='32px' width='48px' />
                <div className='dw-transactions__transaction-description'>
                    <Text as='p' color='less-prominent' size='xxs' line_height='m'>
                        {/* TODO: Convert to pretty string */}
                        {transaction.action_type}
                    </Text>
                    <Text as='p' color='prominent' size='xxs' line_height='m' weight='bold'>
                        {/* TODO: Update to dynamic wallet name */}
                        <Localize i18n_default_text='Visa USD Wallet' />
                    </Text>
                </div>
            </div>
            <div className='dw-transactions__transaction-right'>
                <Text as='p' size='xs' line_height='m' weight='bold'>
                    <Money
                        amount={transaction.amount}
                        className={classNames({
                            'dw-transactions__transaction-amount--positive':
                                transaction.amount && transaction.amount > 0,
                            'dw-transactions__transaction-amount--negative':
                                transaction.amount && transaction.amount < 0,
                        })}
                        currency={'USD'}
                        show_currency
                    />
                </Text>
                <Text as='p' color='less-prominent' size='xxs' line_height='s'>
                    <Localize
                        i18n_default_text='Balance: {{ balance_amount }}'
                        values={{
                            // TODO: Update currency.
                            balance_amount: getFormattedText(transaction.balance_after, 'USD'),
                        }}
                    />
                </Text>
            </div>
        </div>
    );
};

type TTransactionsTransaction = {
    transaction: Transaction;
};

export default TransactionsTransaction;
