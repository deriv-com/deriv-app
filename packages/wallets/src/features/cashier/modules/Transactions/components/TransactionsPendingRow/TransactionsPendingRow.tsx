import React, { useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { WalletCurrencyCard } from '../../../../../../components/WalletCurrencyCard';
import IcCrossLight from '../../../../../../public/images/ic-cross-light.svg';
import { THooks } from '../../../../../../types';
import { CancelTransactionModal } from '../../../../components/CancelTransactionModal';
import './TransactionsPendingRow.scss';

const statusCodeMapper = {
    deposit: {
        CONFIRMED: {
            description: 'Your deposit is successful.',
            name: 'Successful',
        },
        ERROR: {
            description:
                'Your deposit is unsuccessful due to an error on the blockchain. Please contact your crypto wallet service provider for more info.',
            name: 'Unsuccessful',
        },
        PENDING: {
            description: 'We’ve received your request and are waiting for more blockchain confirmations.',
            name: 'In process',
        },
    },
    withdrawal: {
        CANCELLED: {
            description: 'You’ve cancelled your withdrawal request.',
            name: 'Cancelled',
        },
        ERROR: {
            description:
                'Your withdrawal is unsuccessful due to an error on the blockchain. Please contact us via live chat for more info.',
            name: 'Unsuccessful',
        },
        LOCKED: {
            description:
                "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
            name: 'In review',
        },
        PERFORMING_BLOCKCHAIN_TXN: {
            description: 'We’re sending your request to the blockchain.',
            name: 'In process',
        },
        PROCESSING: {
            description: 'We’re awaiting confirmation from the blockchain.',
            name: 'In process',
        },
        REJECTED: {
            description: "Your withdrawal is unsuccessful. We've sent you an email with more information.",
            name: 'Unsuccessful',
        },
        REVERTED: {
            description: "Your withdrawal is unsuccessful. We've sent you an email with more information.",
            name: 'Unsuccessful',
        },
        REVERTING: {
            description: "We're processing your withdrawal.",
            name: 'In process',
        },
        SENT: {
            description: 'Your withdrawal is successful.',
            name: 'Successful',
        },
        VERIFIED: {
            description: 'We’re processing your withdrawal.',
            name: 'In process',
        },
    },
};

type TProps = {
    transaction: THooks.CryptoTransactions;
};

const TransactionsCryptoRow: React.FC<TProps> = ({ transaction }) => {
    const { data } = useActiveWalletAccount();
    const displayCode = useMemo(() => data?.currency_config?.display_code || 'USD', [data]);
    const formattedStatus = useMemo(() => {
        if (transaction.transaction_type === 'deposit') {
            return statusCodeMapper.deposit[transaction.status_code];
        } else if (transaction.transaction_type === 'withdrawal') {
            return statusCodeMapper.withdrawal[transaction.status_code];
        }
    }, [transaction]);
    const { show } = useModal();

    return (
        <div className='wallets-transactions-pending-row'>
            <div className='wallets-transactions-pending-row__details'>
                <WalletCurrencyCard currency={data?.currency || 'USD'} isDemo={data?.is_virtual} size='md' />
                <div className='wallets-transactions-pending-row__column'>
                    <WalletText color='primary' size='xs'>
                        {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                    </WalletText>
                    <WalletText color='general' size='xs' weight='bold'>
                        {displayCode} Wallet
                    </WalletText>
                </div>
            </div>
            <div
                className={classNames(
                    'wallets-transactions-pending-row__column',
                    'wallets-transactions-pending-row__transaction-hash'
                )}
            >
                <WalletText color='primary' size='xs'>
                    Transaction hash
                </WalletText>
                <WalletText color='red' size='xs' weight='bold'>
                    {transaction.formatted_transaction_hash}
                </WalletText>
            </div>
            <div
                className={classNames(
                    'wallets-transactions-pending-row__column',
                    'wallets-transactions-pending-row__transaction-address'
                )}
            >
                <WalletText color='primary' size='xs'>
                    Address
                </WalletText>
                <WalletText color='red' size='xs' weight='bold'>
                    {transaction.formatted_address_hash}
                </WalletText>
            </div>
            <div
                className={classNames(
                    'wallets-transactions-pending-row__column',
                    'wallets-transactions-pending-row__transaction-confirmations'
                )}
            >
                <WalletText color='primary' size='xs'>
                    Confirmations
                </WalletText>
                <WalletText align='center' color='red' size='xs' weight='bold'>
                    {transaction.formatted_confirmations}
                </WalletText>
            </div>
            <div
                className={classNames(
                    'wallets-transactions-pending-row__column',
                    'wallets-transactions-pending-row__transaction-time'
                )}
            >
                <WalletText color='primary' size='xs'>
                    Time
                </WalletText>
                <WalletText color='general' size='2xs'>
                    {moment.unix(transaction.submit_date).format('DD MMM YYYY HH:mm:ss [GMT]')}
                </WalletText>
            </div>
            <div
                className={classNames(
                    'wallets-transactions-pending-row__column',
                    'wallets-transactions-pending-row__transaction-amount'
                )}
            >
                <WalletText align='right' color={transaction.is_deposit ? 'success' : 'red'} size='sm' weight='bold'>
                    {transaction.is_deposit ? '+' : '-'}
                    {transaction.formatted_amount}
                </WalletText>
            </div>
            <div className={classNames('wallets-transactions-pending-row__transaction-status')}>
                <div
                    className={classNames(
                        'wallets-transactions-pending-row__transaction-status__dot',
                        `wallets-transactions-pending-row__transaction-status__dot--${transaction.status_code
                            .toLowerCase()
                            .replace('_', '-')}`
                    )}
                />
                <WalletText color='general' size='sm'>
                    {formattedStatus?.name}
                </WalletText>
                {transaction.is_valid_to_cancel && (
                    <button
                        className='wallets-transactions-pending-row__transaction-cancel-button'
                        onClick={() => show(<CancelTransactionModal transactionId={transaction.id} />)}
                    >
                        <IcCrossLight />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TransactionsCryptoRow;
