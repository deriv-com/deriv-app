import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useActiveWalletAccount, useCancelCryptoTransaction } from '@deriv/api';
import { WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { WalletCurrencyCard } from '../../../../../../components/WalletCurrencyCard';
import useDevice from '../../../../../../hooks/useDevice';
import IcCrossLight from '../../../../../../public/images/ic-cross-light.svg';
import { THooks } from '../../../../../../types';
import { WalletActionModal } from '../../../../components/WalletActionModal';
import './TransactionsPendingRow.scss';

type TProps = {
    transaction: THooks.CryptoTransactions;
};

const TransactionsCryptoRow: React.FC<TProps> = ({ transaction }) => {
    const { data } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const displayCode = useMemo(() => data?.currency_config?.display_code || 'USD', [data]);
    const { hide, show } = useModal();

    const { mutate } = useCancelCryptoTransaction();

    const cancelTransaction = useCallback(() => {
        mutate({ payload: { id: transaction.id } });
        hide();
    }, [hide, mutate, transaction.id]);

    const onCancelButtonClick = useCallback(() => {
        show(
            <WalletActionModal
                actionButtonsOptions={[
                    {
                        onClick: hide,
                        text: "No, don't cancel",
                    },
                    {
                        isPrimary: true,
                        onClick: cancelTransaction,
                        text: 'Yes, cancel',
                    },
                ]}
                description='Are you sure you want to cancel this transaction?'
                hideCloseButton={true}
                title='Cancel transaction'
            />
        );
    }, [cancelTransaction, hide, show]);

    return (
        <div className='wallets-transactions-pending-row'>
            <div className='wallets-transactions-pending-row__wallet-info'>
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
            <div className='wallets-transactions-pending-row__fields-container'>
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
                    className={classNames('wallets-transactions-pending-row__column', {
                        'wallets-transactions-pending-row__transaction-confirmations': !isMobile,
                    })}
                >
                    <WalletText color='primary' size='xs'>
                        Confirmations
                    </WalletText>
                    <WalletText align={isMobile ? 'start' : 'center'} color='red' size='xs' weight='bold'>
                        {transaction.formatted_confirmations}
                    </WalletText>
                </div>
                {isMobile && (
                    <React.Fragment>
                        <div className='wallets-transactions-pending-row__column'>
                            <WalletText color='primary' size='xs'>
                                Amount
                            </WalletText>
                            <WalletText color='red' size='xs' weight='bold'>
                                {transaction.is_deposit ? '+' : '-'}
                                {transaction.formatted_amount}
                            </WalletText>
                        </div>
                        <div className='wallets-transactions-pending-row__column'>
                            <WalletText color='primary' size='xs'>
                                Date
                            </WalletText>
                            <WalletText size='xs' weight='bold'>
                                {moment.unix(transaction.submit_date).format('DD MMM YYYY')}
                            </WalletText>
                        </div>
                    </React.Fragment>
                )}
                <div
                    className={classNames(
                        'wallets-transactions-pending-row__column',
                        'wallets-transactions-pending-row__transaction-time'
                    )}
                >
                    <WalletText color='primary' size='xs'>
                        Time
                    </WalletText>
                    <WalletText color='general' size={isMobile ? 'xs' : '2xs'} weight={isMobile ? 'bold' : 'regular'}>
                        {moment
                            .unix(transaction.submit_date)
                            .format(isMobile ? 'HH:mm:ss [GMT]' : 'DD MMM YYYY HH:mm:ss [GMT]')}
                    </WalletText>
                </div>
                {!isMobile && (
                    <div
                        className={classNames(
                            'wallets-transactions-pending-row__column',
                            'wallets-transactions-pending-row__transaction-amount'
                        )}
                    >
                        <WalletText
                            align='right'
                            color={transaction.is_deposit ? 'success' : 'red'}
                            size='sm'
                            weight='bold'
                        >
                            {transaction.is_deposit ? '+' : '-'}
                            {transaction.formatted_amount}
                        </WalletText>
                    </div>
                )}
            </div>
            <div className={classNames('wallets-transactions-pending-row__transaction-status')}>
                <div
                    className={classNames(
                        'wallets-transactions-pending-row__transaction-status-dot',
                        `wallets-transactions-pending-row__transaction-status-dot--${transaction.status_code
                            .toLowerCase()
                            .replace('_', '-')}`
                    )}
                />
                <WalletText color='general' size='sm'>
                    {transaction.status_name}
                </WalletText>
                {!isMobile && transaction.is_valid_to_cancel && (
                    <button
                        className='wallets-transactions-pending-row__transaction-cancel-button'
                        onClick={onCancelButtonClick}
                    >
                        <IcCrossLight />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TransactionsCryptoRow;
