import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';
import { cryptoTransactionMapper } from '../../../../helpers';

type TCryptoTransaction = {
    transaction: ReturnType<typeof cryptoTransactionMapper>;
    currency_display_code: string;
};

const CryptoTransaction = ({ currency_display_code: currency, transaction }: TCryptoTransaction) => {
    return (
        <div className='crypto-transactions-side-note-recent-transaction__content'>
            <Text size='xxs'>
                {transaction.is_deposit ? (
                    <Localize i18n_default_text='Deposit {{currency}}' values={{ currency }} />
                ) : (
                    <Localize i18n_default_text='Withdrawal {{currency}}' values={{ currency }} />
                )}
            </Text>
            <Text size='xxxs' color='less-prominent' className='crypto-transactions-side-note-recent-transaction__date'>
                <Localize
                    i18n_default_text='{{amount}} {{currency}} on {{date}}'
                    values={{
                        amount: transaction.amount,
                        currency,
                        date: transaction.submit_date_display,
                    }}
                />
            </Text>
            <Text size='xxxs'>
                <Localize
                    i18n_default_text='Address: <0>{{value}}</0>'
                    values={{ value: transaction.address_url_display }}
                    components={[<Text key={0} size='xxxs' color='red' />]}
                />
            </Text>
            <Text size={'xxxs'}>
                <Localize
                    i18n_default_text='Transaction hash: <0>{{value}}</0>'
                    values={{ value: transaction.transaction_hash_display }}
                    components={[<Text key={0} size='xxxs' color='red' />]}
                />
            </Text>
            {transaction.is_deposit && (
                <Text size='xxxs'>
                    <Localize
                        i18n_default_text='Confirmations: <0>{{value}}</0>'
                        values={{ value: transaction.confirmation_display }}
                        components={[<Text key={0} size='xxxs' color='red' />]}
                    />
                </Text>
            )}
            <div className='crypto-transactions-side-note-recent-transaction__status'>
                <div
                    className={classNames(
                        'crypto-transactions-side-note-recent-transaction__status-dot',
                        `crypto-transactions-side-note-recent-transaction__status-dot-${transaction.status_color}`
                    )}
                />
                <Text size='xxxs'>{transaction.status_name}</Text>
            </div>
        </div>
    );
};

export default CryptoTransaction;
