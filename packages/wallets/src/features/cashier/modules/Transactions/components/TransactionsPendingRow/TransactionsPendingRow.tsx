import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useActiveWalletAccount, useCancelCryptoTransaction } from '@deriv/api';
import { WalletButton, WalletText } from '../../../../../../components/Base';
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

    const transactionFields: {
        class?: classNames.ArgumentArray[number];
        name: string;
        onInteraction?: VoidFunction;
        value: number | string;
        valueTextProps?: Omit<React.ComponentProps<typeof WalletText>, 'children'>;
    }[] = useMemo(
        () => [
            {
                class: { 'wallets-transactions-pending-row__transaction-hash': !isMobile },
                name: 'Transaction hash',
                onInteraction: () =>
                    show(
                        <WalletActionModal
                            actionButtonsOptions={[
                                {
                                    isPrimary: true,
                                    onClick: () => {},
                                    text: 'View',
                                },
                            ]}
                            description='View transaction hash on Blockchain.'
                            title='Transaction details'
                        />
                    ),
                value: transaction.formatted_transaction_hash,
            },
            {
                class: { 'wallets-transactions-pending-row__transaction-address': !isMobile },
                name: 'Address',
                value: transaction.formatted_address_hash,
            },
            {
                class: { 'wallets-transactions-pending-row__transaction-confirmations': !isMobile },
                name: 'Confirmations',
                value: transaction.formatted_confirmations,
                valueTextProps: {
                    align: isMobile ? 'start' : 'center',
                },
            },
            ...(isMobile
                ? ([
                      {
                          name: 'Amount',
                          value: `${transaction.is_deposit ? '+' : '-'}${transaction.formatted_amount}`,
                          valueTextProps: {
                              color: transaction.is_deposit ? 'success' : 'red',
                          },
                      },
                      {
                          name: 'Date',
                          value: moment.unix(transaction.submit_date).format('DD MMM YYYY'),
                          valueTextProps: { color: 'general' },
                      },
                  ] as const)
                : []),
            {
                class: { 'wallets-transactions-pending-row__transaction-time': !isMobile },
                name: 'Time',
                value: moment
                    .unix(transaction.submit_date)
                    .format(isMobile ? 'HH:mm:ss [GMT]' : 'DD MMM YYYY HH:mm:ss [GMT]'),
                valueTextProps: {
                    color: 'general',
                    size: isMobile ? 'xs' : '2xs',
                    weight: isMobile ? 'bold' : 'regular',
                },
            },
        ],
        [
            isMobile,
            show,
            transaction.formatted_address_hash,
            transaction.formatted_amount,
            transaction.formatted_confirmations,
            transaction.formatted_transaction_hash,
            transaction.is_deposit,
            transaction.submit_date,
        ]
    );

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
                {transactionFields.map(field => (
                    <div
                        className={classNames('wallets-transactions-pending-row__column', field.class)}
                        key={field.name}
                    >
                        <WalletText color='primary' size='xs'>
                            {field.name}
                        </WalletText>
                        <WalletText {...{ color: 'red', size: 'xs', weight: 'bold', ...field.valueTextProps }}>
                            <span onClick={field.onInteraction} role='button'>
                                {field.value}
                            </span>
                        </WalletText>
                    </div>
                ))}
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
            <div className='wallets-transactions-pending-row__transaction-status'>
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
            {isMobile && transaction.is_valid_to_cancel && (
                <WalletButton
                    isFullWidth={true}
                    onClick={onCancelButtonClick}
                    size='sm'
                    text='Cancel transaction'
                    variant='outlined'
                />
            )}
        </div>
    );
};

export default TransactionsCryptoRow;
