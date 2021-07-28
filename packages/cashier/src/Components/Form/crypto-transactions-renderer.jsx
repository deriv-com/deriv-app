import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Icon, Popover, Table, Text } from '@deriv/components';
import { epochToMoment, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CryptoTransactionsRenderer = ({ row: crypto, cancelCryptoTransaction, currency, onClickCancelTransaction }) => {
    let { address_hash, address_url, amount, id, is_valid_to_cancel, status_code, submit_date, transaction_hash, transaction_url, transaction_type } = crypto;

    const formatted_address_hash = address_hash? `${address_hash.substring(0,4)}....${address_hash.substring(address_hash.length - 4)}` : '';
    transaction_hash = transaction_hash? `${transaction_hash.substring(0,4)}....${transaction_hash.substring(transaction_hash.length - 4)}` : 'Pending';

    const format_string = 'DD MMM YYYY HH:mm:ss [GMT]';
    submit_date = epochToMoment(submit_date).format(format_string);

    amount = transaction_type === 'withdrawal'? `-${amount}` : amount;
    status_code = status_code.toLowerCase();
    const status_list = {
        locked: {
            description: 'In review'
        },
        pending: {
            description: 'Pending'
        },
        processing: {
            description: 'In process'
        },
        verified: {
            description: 'Successful'
        }
    };

    const [ has_transaction_clicked, setTransactionClicked ] = React.useState(false);
    
    const onClickCancel = () => {
        setTransactionClicked(true);
    };

    const onClickNo = () => {
        setTransactionClicked(false);
    };

    const cancelTransaction = () => {
        cancelCryptoTransaction(id);
    };

    const showCancelModal = () => {
        onClickCancelTransaction(id);
    };

    if(isMobile()) {
        return (
            <div>
                <Table.Row
                    className='crypto-transactions-history__table-row'
                >
                    <Table.Cell className='crypto-transactions-history__table-type'>
                        { transaction_type === 'withdrawal' && <Icon icon='IcCashierWithdrawal' size={32} /> }
                        { transaction_type === 'deposit' && <Icon icon='IcCashierDeposit' size={32} /> }
                        <Text as='p' size='xs' weight='bold'>{transaction_type}</Text>
                        <div className='crypto-transactions-history__table-status'>
                            <div className= {classNames('crypto-transactions-history__table-status-code', 
                                `crypto-transactions-history__table-status-code-${status_code}`
                            )} />
                            {localize(status_list[status_code].description)}
                        </div>
                    </Table.Cell>
                    <Table.Cell>
                        <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Amount')}</Text>
                    </Table.Cell>
                    <Table.Cell className='crypto-transactions-history__table-amount'>
                        <Text as='p' size='xxs' className={`crypto-transactions-history__table-amount-${transaction_type}`} weight='bold'>
                            {localize(`${amount} ${currency}`)}
                        </Text>
                    </Table.Cell>
                    <Table.Cell>
                        <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Address')}</Text>
                    </Table.Cell>
                    <Table.Cell className='crypto-transactions-history__table-hash'>
                        <a className='crypto-transactions-history__table-link' 
                            href={address_url} target='_blank'>
                            <Text as='p' size='xxs' color='red'>{address_hash}</Text>
                        </a>
                    </Table.Cell> 
                    <Table.Cell>
                        <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Transaction hash')}</Text>
                    </Table.Cell>
                     <Table.Cell className='crypto-transactions-history__table-hash'>
                        <a className='crypto-transactions-history__table-link' 
                            href={transaction_url} target='_blank'>
                            <Text as='p' size='xxs' color='red'>{transaction_hash}</Text>
                        </a>
                    </Table.Cell>
                    <Table.Cell>
                        <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Time')}</Text>
                    </Table.Cell>
                    <Table.Cell className='crypto-transactions-history__table-time'>
                        <Text as='p' color='prominent' size='xxs'>{localize(submit_date)}</Text>
                    </Table.Cell>
                    <Table.Cell className='crypto-transactions-history__table-action'>
                        {is_valid_to_cancel === 1 && <Button onClick={showCancelModal} text={localize('Cancel transaction')} small secondary />}
                    </Table.Cell>
                </Table.Row>
            </div>
        );
    }

    return (
        <div>
            <Table.Row
                className='crypto-transactions-history__table-row'
            >
                <Table.Cell className='crypto-transactions-history__table-type'>
                    { transaction_type === 'withdrawal' && <Icon icon='IcCashierWithdrawal' size={32} /> }
                    { transaction_type === 'deposit' && <Icon icon='IcCashierDeposit' size={32} /> }
                    <Text as='p' size='xs' weight='bold'>{transaction_type}</Text>
                </Table.Cell>
                <Table.Cell className='crypto-transactions-history__table-amount'>
                    <Text as='p' size='xs' className={`crypto-transactions-history__table-amount-${transaction_type}`} weight='bold'>
                        {localize(`${amount} ${currency}`)}
                    </Text>
                </Table.Cell>
                <Table.Cell className='crypto-transactions-history__table-hash'>
                    <Popover 
                        alignment='right' 
                        className='crypto-transactions-history__table-popover'
                        message={localize('View address on Blockchain')}
                    >
                        <a className='crypto-transactions-history__table-link' 
                            href={address_url} target='_blank'>
                            <Text as='p' size='xs' color='red'>{formatted_address_hash}</Text>
                        </a>
                    </Popover>
                </Table.Cell>
                <Table.Cell className='crypto-transactions-history__table-hash'>
                    <Popover 
                        alignment='right' 
                        className='crypto-transactions-history__table-popover'
                        message={localize('View transaction on Blockchain')}
                    >
                        <a className='crypto-transactions-history__table-link' 
                            href={transaction_url} target='_blank'>
                            <Text as='p' size='xs' color='red'>{transaction_hash}</Text>
                        </a>
                    </Popover>
                </Table.Cell>
                { !has_transaction_clicked &&
                    <Table.Cell>
                        {localize(submit_date)}
                    </Table.Cell>
                }
                { !has_transaction_clicked &&
                    <Table.Cell className='crypto-transactions-history__table-status'>
                        <div className= {classNames('crypto-transactions-history__table-status-code', 
                            `crypto-transactions-history__table-status-code-${status_code}`
                        )} />
                        {localize(status_list[status_code].description)}
                    </Table.Cell>
                }
                { has_transaction_clicked ? 
                    <Table.Cell className='crypto-transactions-history__table-confirm'>
                        <div>
                            <Text as='p' color='prominent' size='xxs'>{localize('Are you sure you want to cancel this transaction?')}</Text>
                            <Button onClick={cancelTransaction} primary text={localize('Yes')} />
                            <Button onClick={onClickNo} secondary text={localize('No')} />
                        </div>
                    </Table.Cell> :
                    <Table.Cell className='crypto-transactions-history__table-action'>
                        {is_valid_to_cancel === 1 && <div onClick={onClickCancel}>
                            <Popover
                                alignment='left'
                                className='crypto-transactions-history__table-popover'
                                message={localize('Cancel transaction')}
                            >
                                <Icon icon='IcCross' />                         
                            </Popover>
                        </div>}
                    </Table.Cell>
                }   
            </Table.Row>
        </div>
    );
};

CryptoTransactionsRenderer.propTypes = {
    crypto: PropTypes.object,
    currency: PropTypes.string,
    cancelCryptoTransaction: PropTypes.func,
    onClickCancelTransaction: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    currency: client.currency,
    cancelCryptoTransaction: modules.cashier.cancelCryptoTransaction,
    onClickCancelTransaction: modules.cashier.onClickCancelTransaction,
}))(CryptoTransactionsRenderer);
