import React from 'react';
import classNames from 'classnames';
import { WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import IcCrossLight from '../../../../../../public/images/ic-cross-light.svg';
import { THooks } from '../../../../../../types';
import useRecentTransactions from '../../hooks/useRecentTransactions';
import { CancelTransactionModal } from '../CancelTransactionModal';
import './CryptoTransaction.scss';

type TCryptoTransaction = {
    currencyDisplayCode: THooks.CurrencyConfig['code'];
    transaction: NonNullable<ReturnType<typeof useRecentTransactions>['recentTransactions']>[number];
};

const CryptoTransaction: React.FC<TCryptoTransaction> = ({ currencyDisplayCode: currency, transaction }) => {
    const { show } = useModal();

    return (
        <div className='crypto-transaction'>
            <div className='crypto-transaction--type-and-status'>
                <WalletText lineHeight='sm' size='xs'>
                    {transaction.is_deposit ? `Deposit ${currency}` : `Withdrawal ${currency}`}
                </WalletText>
                <div className='crypto-transaction-status'>
                    <div
                        className={classNames(
                            'crypto-transaction-status-dot',
                            `crypto-transaction-status-dot--${transaction.statusColor}`
                        )}
                    />
                    <WalletText lineHeight='2xs' size='2xs'>
                        {transaction.statusName}
                    </WalletText>
                    {!!transaction.is_valid_to_cancel && (
                        <div
                            className='crypto-transaction--cancel-button'
                            onClick={() => show(<CancelTransactionModal onCancel={() => {}} />)}
                        >
                            <IcCrossLight />
                        </div>
                    )}
                </div>
            </div>
            <div className='crypto-transaction--amount-and-date'>
                <WalletText color='less-prominent' size='2xs'>
                    {transaction.amount} {currency}
                </WalletText>
                <WalletText color='less-prominent' size='2xs'>
                    {transaction.submitDateDisplay}
                </WalletText>
            </div>
            <WalletText lineHeight='2xs' size='2xs'>
                Address:{' '}
                <a className='crypto-transaction--red-text' href={transaction.address_url}>
                    {transaction.addressHashDisplay}
                </a>
            </WalletText>
            <WalletText lineHeight='2xs' size='2xs'>
                Transaction hash:{' '}
                <a className='crypto-transaction--red-text' href={transaction.transaction_url}>
                    {transaction.transactionHashDisplay}
                </a>
            </WalletText>
            {transaction.is_deposit && (
                <div>
                    <WalletText lineHeight='2xs' size='2xs'>
                        Confirmations:{' '}
                        <span className='crypto-transaction--red-text'>{transaction.confirmationDisplay}</span>
                    </WalletText>
                </div>
            )}
        </div>
    );
};

export default CryptoTransaction;
