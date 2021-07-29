import PropTypes from 'prop-types';
import React from 'react';
import { Button, Text, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { epochToMoment } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { getStatus } from '../../Constants/transaction-status';

const RecentTransaction = ({ crypto_transactions, currency }) => {
    let { address_hash, status_code, submit_date, transaction_hash, transaction_type } = crypto_transactions[
        crypto_transactions.length - 1
    ];

    submit_date = epochToMoment(submit_date).format('MMM D, YYYY');
    transaction_type = transaction_type[0].toUpperCase() + transaction_type.slice(1);
    transaction_hash = transaction_hash
        ? `${transaction_hash?.substring(0, 4)}....${transaction_hash?.substring(transaction_hash.length - 4)}`
        : localize('Pending');
    address_hash = `${address_hash.substring(0, 4)}....${address_hash.substring(address_hash.length - 4)}`;
    status_code = getStatus(status_code);

    const amount = crypto_transactions[crypto_transactions.length - 1].amount;

    return (
        <div className='cashier-recent-transaction-wrapper'>
            <div className='cashier-recent-transaction'>
                <Text weight='bold' as='p' line_height='s' size='xs'>
                    <Localize i18n_default_text='Recent Transactions' />
                </Text>
                <div className='cashier-recent-transaction__data-wrapper'>
                    <Icon
                        className='cashier-recent-transaction__icon'
                        icon={transaction_type === 'deposit' ? 'IcCashierAdd' : 'IcCashierMinus'}
                        size={32}
                    />
                    <div>
                        <div className='cashier-recent-transaction__status-wrapper'>
                            <Text as='p' size='xxs'>
                                {`${transaction_type} ${currency}`}
                            </Text>
                            <div className='cashier-recent-transaction__status'>
                                <span
                                    className='cashier-recent-transaction__status-indicator'
                                    style={{ backgroundColor: status_code === 'Successful' ? '#4bb4b3' : '#ffad3a' }}
                                />
                                <Text as='p' size='xxxs'>
                                    {`${status_code}`}
                                </Text>
                            </div>
                        </div>
                        <Text as='p' size='xxxs' color='less-prominent' line_height='s'>
                            {`${amount} ${currency} on ${submit_date}`}
                        </Text>
                        <div className='cashier-recent-transaction__hash-wrapper'>
                            <div className='cashier-recent-transaction__hash'>
                                <Text as='p' size='xxxs' line_height='s'>
                                    <Localize i18n_default_text='Address:' />
                                    &nbsp;
                                </Text>
                                <Text as='p' size='xxxs' color='red' line_height='s'>
                                    {address_hash}
                                </Text>
                            </div>

                            <div className='cashier-recent-transaction__hash'>
                                <Text as='p' size='xxxs' line_height='xs'>
                                    <Localize i18n_default_text='Transaction hash:' />
                                    &nbsp;
                                </Text>
                                <Text as='p' size='xxxs' color='red' line_height='s'>
                                    {transaction_hash}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                <Button to='#' type='button' secondary className='cashier-recent-transaction__view-all-button'>
                    <Text weight='bold' as='p' size='xxs'>
                        <Localize i18n_default_text='View all' />
                    </Text>
                </Button>
            </div>
        </div>
    );
};

RecentTransaction.propTypes = {
    crypto_transactions: PropTypes.array,
    currency: PropTypes.string,
};

export default connect(({ modules, client }) => ({
    crypto_transactions: modules.cashier.crypto_transactions,
    currency: client.currency,
}))(RecentTransaction);
