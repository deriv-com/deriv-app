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
        showCancelModal,
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
            transaction_type,
        } = crypto;
        const formatted_address_hash = address_hash ? 
            `${address_hash.substring(0,4)}....${address_hash.substring(address_hash.length - 4)}` 
            : '';
        const formatted_transaction_hash = transaction_hash ? 
            `${transaction_hash.substring(0,4)}....${transaction_hash.substring(transaction_hash.length - 4)}` 
            : localize('Pending');
        const formatted_amount = transaction_type === 'withdrawal' ? `-${amount}` : `+${amount}`;
        const formatted_submit_date = epochToMoment(submit_date).format('DD MMM YYYY HH:mm:ss [GMT]');
        const formatted_status_code = status_code.toLowerCase();
        const status_list = {
            confirmed: {
                description: localize('Successful'),
            },
            locked: {
                description: localize('In review'),
            },
            pending: {
                description: localize('Pending'),
            },
            performing_blockchain_txn: {
                description: localize('In process'),
            },
            processing: {
                description: localize('In process'),
            },
            sent: {
                description: localize('Successful'),
            },
            verified: {
                description: localize('In process'),
            },
        };

        const [ is_transaction_clicked, setTransactionClicked ] = React.useState(false);
        const onClickCancel = () => {
            setTransactionClicked(true);
        };
        const onClickNo = () => {
            setTransactionClicked(false);
        };
        const cancelTransaction = () => {
            cancelCryptoTransaction(id);
        };
        const onClickCancelTransaction = () => {
            showCancelModal(id);
        };
        const TransactionIcon = () => {
            return <Icon icon={transaction_type === 'withdrawal' ? 'IcCashierWithdrawal' : 'IcCashierDeposit'} size={32} />;
        }
        const TransactionType = () => {
            return (
                <Text 
                    as='p' 
                    size='xs' 
                    weight='bold' 
                    className={isMobile() ? 'crypto-transactions-history__table-type' : ''}
                >
                    {transaction_type}
                </Text>
            );
        }
        const Amount = () => {
            return (
                <Text 
                    as='p' 
                    size={isMobile() ? 'xxs' : 'xs'} 
                    weight='bold' 
                    color={transaction_type === 'withdrawal' ? 'red' : 'profit-success'} 
                >
                    {`${formatted_amount} ${currency}`}
                </Text>
            );
        }
        const AddressHash = () => {
            return (
                <a className='crypto-transactions-history__table-link' 
                    href={address_url} 
                    rel='noreferrer'
                    target='_blank'>
                    <Text 
                        as='p' 
                        size={isMobile() ? 'xxs' : 'xs'} 
                        color='red'
                    >
                        {isMobile() ? address_hash : formatted_address_hash}
                    </Text>
                </a>
            );
        }
        const TransactionHash = () => {
            return (
                <a className='crypto-transactions-history__table-link' 
                    href={transaction_url} 
                    rel='noreferrer'
                    target='_blank'>
                    <Text 
                        as='p' 
                        size={isMobile() ? 'xxs' : 'xs'} 
                        color='red'>
                            {formatted_transaction_hash}
                    </Text>
                </a>
            );
        }
        const TransactionTime = () => {
            return <Text as='p' size={isMobile() ? 'xxs' : 'xs'}>{formatted_submit_date}</Text>;
        }
        const StatusIndicator = () => {
            return (
                <div className= {classNames('crypto-transactions-history__table-status-code', {
                    'crypto-transactions-history__table-status-code-successful' : 
                        formatted_status_code === 'confirmed' || formatted_status_code === 'sent',
                })} />
            );
        }
        const Status = () => {
            return <Text as='p' size={isMobile() ? 'xxs' : 'xs'}>{status_list[formatted_status_code].description}</Text>;
        }

        if(isMobile()) {
            return (
                <div>
                    <Table.Row className='crypto-transactions-history__table-row'>
                        <Table.Cell className='crypto-transactions-history__table-cell'>
                            <TransactionIcon />
                            <TransactionType />
                            <div className='crypto-transactions-history__table-status'>
                                <StatusIndicator />
                                <Status />
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Amount')}</Text>
                        </Table.Cell>
                        <Table.Cell className='crypto-transactions-history__table-amount'>
                            <Amount />
                        </Table.Cell>
                        <Table.Cell>
                            <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Address')}</Text>
                        </Table.Cell>
                        <Table.Cell className='crypto-transactions-history__table-hash'>
                            <AddressHash />
                        </Table.Cell> 
                        <Table.Cell>
                            <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Transaction hash')}</Text>
                        </Table.Cell>
                        <Table.Cell className='crypto-transactions-history__table-hash'>
                            <TransactionHash />
                        </Table.Cell>
                        <Table.Cell>
                            <Text as='p' color='prominent' size='xxs' weight='bold'>{localize('Time')}</Text>
                        </Table.Cell>
                        <Table.Cell className='crypto-transactions-history__table-time'>
                            <TransactionTime />
                        </Table.Cell>
                        <Table.Cell className='crypto-transactions-history__table-action'>
                            {is_valid_to_cancel === 1 && <Button 
                                onClick={onClickCancelTransaction} 
                                small 
                                secondary >
                                    <Text as='p' size='xxxs'>
                                        <Localize i18n_default_text='Cancel transaction' />
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
                <Table.Row className='crypto-transactions-history__table-row'>
                    <Table.Cell className='crypto-transactions-history__table-type'>
                        <TransactionIcon />
                        <TransactionType />
                    </Table.Cell>
                    <Table.Cell className='crypto-transactions-history__table-amount'>
                        <Amount />
                    </Table.Cell>
                    <Table.Cell className='crypto-transactions-history__table-hash'>
                        <Popover 
                            alignment='right' 
                            className='crypto-transactions-history__table-popover'
                            message={localize('View address on Blockchain')}
                        >
                            <AddressHash />
                        </Popover>
                    </Table.Cell>
                    <Table.Cell className='crypto-transactions-history__table-hash'>
                        { transaction_url ?
                            <Popover 
                                alignment='right' 
                                className='crypto-transactions-history__table-popover'
                                message={transaction_url? localize('View transaction on Blockchain') : ''}
                            >
                                <TransactionHash />
                            </Popover> :
                            <Text as='p' size='xs' color='red'>{formatted_transaction_hash}</Text>
                        }
                    </Table.Cell>
                    { !is_transaction_clicked &&
                        <Table.Cell>
                            <TransactionTime />
                        </Table.Cell>
                    }
                    { !is_transaction_clicked &&
                        <Table.Cell className='crypto-transactions-history__table-status'>
                            <Popover
                                alignment='left'
                                className='crypto-transactions-history__table-popover'
                                message={ formatted_status_code === 'locked' 
                                    ? localize("Your withdrawal request has been submitted. We're reviewing it now.") 
                                    : '' 
                                }
                            >
                                <StatusIndicator />
                                <Status />
                            </Popover>
                        </Table.Cell>
                    }
                    { is_transaction_clicked ? 
                        <Table.Cell className='crypto-transactions-history__table-confirm'>
                            <div>
                                <Text as='p' color='prominent' size='xxs'>
                                    {localize('Are you sure you want to cancel this transaction?')}
                                </Text>
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
    showCancelModal: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    currency: client.currency,
    cancelCryptoTransaction: modules.cashier.cancelCryptoTransaction,
    showCancelModal: modules.cashier.showCancelModal,
}))(CryptoTransactionsRenderer);
