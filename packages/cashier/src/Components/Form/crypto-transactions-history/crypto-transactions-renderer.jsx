import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Icon, Popover, Table, Text } from '@deriv/components';
import { epochToMoment, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CryptoTransactionsRenderer = ({ 
        row: crypto, 
        cancelCryptoTransaction, 
        currency, 
        onClickCancelTransaction,
    }) => {
        const { 
            address_hash, 
            address_url, 
            amount, 
            id, 
            is_valid_to_cancel, 
            status_code, submit_date, 
            transaction_hash, 
            transaction_url, 
            transaction_type 
        } = crypto;

        const formatted_address_hash = address_hash ? `${address_hash.substring(0,4)}....${address_hash.substring(address_hash.length - 4)}` : '';
        const formatted_transaction_hash = transaction_hash ? `${transaction_hash.substring(0,4)}....${transaction_hash.substring(transaction_hash.length - 4)}` : 'Pending';
        const formatted_amount = transaction_type === 'withdrawal' ? `-${amount}` : amount;
        const formatted_submit_date = epochToMoment(submit_date).format('DD MMM YYYY HH:mm:ss [GMT]');
        const formatted_status_code = status_code.toLowerCase();
        const status_list = {
            confirmed: {
                description: localize('Successful'),
                renderer: 'successful',
            },
            locked: {
                description: localize('In review'),
                renderer: 'in-review',
            },
            pending: {
                description: localize('Pending'),
                renderer: 'pending',
            },
            performing_blockchain_txn: {
                description: localize('In process'),
                renderer: 'in-process',
            },
            processing: {
                description: localize('In process'),
                renderer: 'in-process',
            },
            sent: {
                description: localize('Successful'),
                renderer: 'successful',
            },
            verified: {
                description: localize('In process'),
                renderer: 'in-process',
            },
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
                        <Table.Cell className='crypto-transactions-history__table-cell'>
                            <Icon icon={transaction_type === 'withdrawal' ? 'IcCashierWithdrawal' : 'IcCashierDeposit' } size={32} />
                            <Text as='p' size='xs' weight='bold' className='crypto-transactions-history__table-type'>{transaction_type}</Text>
                            <div className='crypto-transactions-history__table-status'>
                                <div className= {classNames('crypto-transactions-history__table-status-code', 
                                    `crypto-transactions-history__table-status-code-${status_list[formatted_status_code].renderer}`
                                )} />
                                <Text as='p' size='xxs'>{status_list[formatted_status_code].description}</Text>
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Amount')}</Text>
                        </Table.Cell>
                        <Table.Cell className='crypto-transactions-history__table-amount'>
                            <Text as='p' size='xxs' weight='bold' color={transaction_type === 'withdrawal' ? 'red' : 'profit-success'} >
                                {localize(`${formatted_amount} ${currency}`)}
                            </Text>
                        </Table.Cell>
                        <Table.Cell>
                            <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Address')}</Text>
                        </Table.Cell>
                        <Table.Cell className='crypto-transactions-history__table-hash'>
                            <a className='crypto-transactions-history__table-link' 
                                href={address_url} 
                                rel='noreferrer'
                                target='_blank'>
                                <Text as='p' size='xxs' color='red'>{address_hash}</Text>
                            </a>
                        </Table.Cell> 
                        <Table.Cell>
                            <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Transaction hash')}</Text>
                        </Table.Cell>
                        <Table.Cell className='crypto-transactions-history__table-hash'>
                            <a className='crypto-transactions-history__table-link' 
                                href={transaction_url} 
                                rel='noreferrer'
                                target='_blank'>
                                <Text as='p' size='xxs' color='red'>{formatted_transaction_hash}</Text>
                            </a>
                        </Table.Cell>
                        <Table.Cell>
                            <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Time')}</Text>
                        </Table.Cell>
                        <Table.Cell className='crypto-transactions-history__table-time'>
                            <Text as='p' color='prominent' size='xxs'>{localize(formatted_submit_date)}</Text>
                        </Table.Cell>
                        <Table.Cell className='crypto-transactions-history__table-action'>
                            {is_valid_to_cancel === 1 && <Button 
                                onClick={showCancelModal} 
                                small 
                                secondary >
                                    <Text as='p' size='xxxs'>
                                        <Localize i18n_default_text='Cancal transaction' />
                                    </Text>
                                </Button>
                            }
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
                        <Icon icon={transaction_type === 'withdrawal' ? 'IcCashierWithdrawal' : 'IcCashierDeposit' } size={32} />
                        <Text as='p' size='xs' weight='bold'>{transaction_type}</Text>
                    </Table.Cell>
                    <Table.Cell className='crypto-transactions-history__table-amount'>
                        <Text as='p' size='xs' weight='bold' color={transaction_type === 'withdrawal' ? 'red' : 'profit-success'} >
                            {localize(`${formatted_amount} ${currency}`)}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='crypto-transactions-history__table-hash'>
                        <Popover 
                            alignment='right' 
                            className='crypto-transactions-history__table-popover'
                            message={localize('View address on Blockchain')}
                        >
                            <a className='crypto-transactions-history__table-link' 
                                href={address_url} 
                                rel='noreferrer'
                                target='_blank'>
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
                                href={transaction_url} 
                                rel='noreferrer'
                                target='_blank'>
                                <Text as='p' size='xs' color='red'>{formatted_transaction_hash}</Text>
                            </a>
                        </Popover>
                    </Table.Cell>
                    { !has_transaction_clicked &&
                        <Table.Cell>
                            {localize(formatted_submit_date)}
                        </Table.Cell>
                    }
                    { !has_transaction_clicked &&
                        <Table.Cell className='crypto-transactions-history__table-status'>
                            <div className= {classNames('crypto-transactions-history__table-status-code', 
                                `crypto-transactions-history__table-status-code-${status_list[formatted_status_code].renderer}`
                            )} />
                            <Text as='p' size='xs'>{status_list[formatted_status_code].description}</Text>
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
