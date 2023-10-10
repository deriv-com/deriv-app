import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { cryptoTransactionMapper } from '../../helpers';
import './crypto-transaction.scss';

type TCryptoTransaction = {
    transaction: ReturnType<typeof cryptoTransactionMapper>;
    currency_display_code: string;
};

const CryptoTransaction = ({ currency_display_code: currency, transaction }: TCryptoTransaction) => {
    const {
        transaction_history: { showCryptoTransactionsCancelModal },
    } = useCashierStore();

    return (
        <div className='crypto-transaction'>
            <div className='crypto-transaction__type-and-status'>
                <Text size='xxs'>
                    {transaction.is_deposit ? (
                        <Localize i18n_default_text='Deposit {{currency}}' values={{ currency }} />
                    ) : (
                        <Localize i18n_default_text='Withdrawal {{currency}}' values={{ currency }} />
                    )}
                </Text>
                <div className='crypto-transaction__status'>
                    <div
                        className={classNames(
                            'crypto-transaction__status-dot',
                            `crypto-transaction__status-dot-${transaction.status_color}`
                        )}
                    />
                    <Text size='xxxs' line_height='s'>
                        {transaction.status_name}
                    </Text>
                    {!!transaction.is_valid_to_cancel && (
                        <Icon
                            icon='IcCrossLight'
                            size={10}
                            className='crypto-transaction__cancel-button'
                            onClick={() => {
                                showCryptoTransactionsCancelModal(transaction.id);
                            }}
                            data_testid='dt_close_icon'
                        />
                    )}
                </div>
            </div>
            <div className='crypto-transaction__amount-and-date'>
                <Text size='xxxs' color='less-prominent'>
                    <Localize
                        i18n_default_text='{{amount}} {{currency}}'
                        values={{
                            amount: transaction.amount,
                            currency,
                        }}
                    />
                </Text>
                <Text size='xxxs' color='less-prominent'>
                    <Localize
                        i18n_default_text='{{date}}'
                        values={{
                            date: transaction.submit_date_display,
                        }}
                    />
                </Text>
            </div>
            <Text size='xxxs'>
                <Localize
                    i18n_default_text='Address: <0>{{value}}</0>'
                    values={{ value: transaction.address_hash_display }}
                    components={[
                        <Text
                            key={0}
                            as='a'
                            href={transaction.address_url}
                            size='xxxs'
                            color='red'
                            className='crypto-transaction__link'
                        />,
                    ]}
                />
            </Text>
            <Text size='xxxs'>
                <Localize
                    i18n_default_text='Transaction hash: <0>{{value}}</0>'
                    values={{ value: transaction.transaction_hash_display }}
                    components={[
                        transaction.transaction_url ? (
                            <Text
                                key={0}
                                as='a'
                                href={transaction.transaction_url}
                                size='xxxs'
                                color='red'
                                className='crypto-transaction__link'
                            />
                        ) : (
                            <Text key={0} size='xxxs' color='red' />
                        ),
                    ]}
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
        </div>
    );
};

export default CryptoTransaction;
