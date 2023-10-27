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
        <div className='wallets-crypto-transaction'>
            <div className='wallets-crypto-transaction__type-and-status'>
                <WalletText lineHeight='sm' size='xs'>
                    {transaction.is_deposit ? `Deposit ${currency}` : `Withdrawal ${currency}`}
                </WalletText>
                <div className='wallets-crypto-transaction__status'>
                    <div
                        className={classNames(
                            'wallets-crypto-transaction__status__dot',
                            `wallets-crypto-transaction__status__dot--${transaction.status_code
                                .toLowerCase()
                                .replace('_', '-')}`
                        )}
                    />
                    <WalletText lineHeight='2xs' size='2xs'>
                        {transaction.statusName}
                    </WalletText>
                    {!!transaction.is_valid_to_cancel && (
                        <button
                            className='wallets-crypto-transaction__cancel-button'
                            onClick={() => show(<CancelTransactionModal transactionId={transaction.id} />)}
                        >
                            <IcCrossLight />
                        </button>
                    )}
                </div>
            </div>
            <div className='wallets-crypto-transaction__amount-and-date'>
                <WalletText color='less-prominent' size='2xs'>
                    {transaction.amount} {currency}
                </WalletText>
                <WalletText color='less-prominent' size='2xs'>
                    {transaction.submitDateDisplay}
                </WalletText>
            </div>
            <WalletText lineHeight='2xs' size='2xs'>
                Address:{' '}
                <a className='wallets-crypto-transaction__red-text' href={transaction.address_url}>
                    {transaction.formatted_address_hash}
                </a>
            </WalletText>
            <WalletText lineHeight='2xs' size='2xs'>
                Transaction hash:{' '}
                <a className='wallets-crypto-transaction__red-text' href={transaction.transaction_url}>
                    {transaction.formatted_transaction_hash}
                </a>
            </WalletText>
            {transaction.is_deposit && (
                <div>
                    <WalletText lineHeight='2xs' size='2xs'>
                        Confirmations:{' '}
                        <span className='wallets-crypto-transaction__red-text'>{transaction.confirmationDisplay}</span>
                    </WalletText>
                </div>
            )}
        </div>
    );
};

export default CryptoTransaction;
