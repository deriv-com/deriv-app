import React, { useMemo } from 'react';
import { useActiveWalletAccount, useCryptoTransactions } from '@deriv/api';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import './WalletTransactionsCryptoRow.scss';

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
    transaction: NonNullable<ReturnType<typeof useCryptoTransactions>['data']>[number];
};

const WalletTransactionsCryptoRow: React.FC<TProps> = ({ transaction }) => {
    const { data } = useActiveWalletAccount();
    const displayCode = useMemo(() => data?.currency_config?.display_code || 'USD', [data]);
    const formattedStatus = useMemo(() => {
        if (transaction.transaction_type === 'deposit') {
            return statusCodeMapper.deposit[transaction.status_code];
        } else if (transaction.transaction_type === 'withdrawal') {
            return statusCodeMapper.withdrawal[transaction.status_code];
        }
    }, [transaction]);

    return (
        <div className='wallets-transactions-crypto-row'>
            <div className='wallets-transactions-crypto-row-details'>
                <WalletCurrencyCard currency={data?.currency || 'USD'} isDemo={data?.is_virtual} size='md' />
                <div>
                    <p className='wallets-transactions-crypto-row__title'>{transaction.transaction_type}</p>
                    <p className='wallets-transactions-crypto-row-details__wallet-name'>{displayCode} Wallet</p>
                </div>
            </div>
            <div className='wallets-transactions-crypto-row__transaction-hash'>
                <p className='wallets-transactions-crypto-row__title'>Transaction hash</p>
                <p className='wallets-transactions-crypto-row__transaction-value'>
                    {transaction.formatted_transaction_hash}
                </p>
            </div>
            <div className='wallets-transactions-crypto-row__transaction-address'>
                <p className='wallets-transactions-crypto-row__title'>Address</p>
                <p className='wallets-transactions-crypto-row__transaction-value'>
                    {transaction.formatted_address_hash}
                </p>
            </div>
            <div>
                <p className='wallets-transactions-crypto-row__title'>Confirmations</p>
                <p className='wallets-transactions-crypto-row__transaction-value wallets-transactions-crypto-row__transaction-value--center'>
                    {transaction.formatted_confirmations}
                </p>
            </div>
            <div>
                <p className='wallets-transactions-crypto-row__title'>Time</p>
                <p>{new Date(transaction.submit_date).toLocaleString()}</p>
            </div>
            <div
                className={`wallets-transactions-crypto-row__transaction-amount ${
                    transaction.is_deposit ? 'wallets-transactions-crypto-row__transaction-amount__deposit' : ''
                }`}
            >
                {transaction.is_deposit ? '+' : '-'}
                {transaction.amount} {displayCode}
            </div>
            <div className='wallets-transactions-crypto-row__transaction-status'>
                <span>{formattedStatus?.name}</span>
            </div>
        </div>
    );
};

export default WalletTransactionsCryptoRow;
