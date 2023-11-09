import React, { useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useHover } from 'usehooks-ts';
import { useActiveWalletAccount, useCancelCryptoTransaction } from '@deriv/api';
import { Tooltip, WalletButton, WalletText } from '../../../../../../components/Base';
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
    const modal = useModal();

    const transactionHashRef = useRef(null);
    const isTransactionHashHovered = useHover(transactionHashRef);
    const addressHashRef = useRef(null);
    const isAddressHashHovered = useHover(addressHashRef);
    const statusRef = useRef(null);
    const isStatusHovered = useHover(statusRef);

    const { mutate } = useCancelCryptoTransaction();

    const cancelTransaction = useCallback(() => {
        mutate({ payload: { id: transaction.id } });
        modal.hide();
    }, [modal, mutate, transaction.id]);

    const onCancelButtonClick = useCallback(() => {
        modal.show(
            <WalletActionModal
                actionButtonsOptions={[
                    {
                        onClick: modal.hide,
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
            />,
            { defaultRootId: 'wallets_modal_root' }
        );
    }, [cancelTransaction, modal]);

    const transactionFields: {
        class?: classNames.ArgumentArray[number];
        hoverMessage?: string;
        name: string;
        onInteraction?: VoidFunction;
        ref?: ReturnType<typeof useRef>;
        shouldShouldHoverMessage?: boolean;
        value: number | string;
        valueTextProps?: Omit<React.ComponentProps<typeof WalletText>, 'children'>;
    }[] = useMemo(
        () => [
            {
                class: { 'wallets-transactions-pending-row__transaction-hash': !isMobile },
                hoverMessage: 'View transaction hash on Blockchain',
                name: 'Transaction hash',
                onInteraction: () =>
                    transaction.transaction_url
                        ? modal.show(
                              <WalletActionModal
                                  actionButtonsOptions={[
                                      {
                                          isPrimary: true,
                                          onClick: () => window.open(transaction.transaction_url),
                                          text: 'View',
                                      },
                                  ]}
                                  description='View transaction hash on Blockchain.'
                                  title='Transaction details'
                              />,
                              { defaultRootId: 'wallets_modal_root' }
                          )
                        : null,
                ref: transactionHashRef,
                shouldShouldHoverMessage: isTransactionHashHovered,
                value: transaction.formatted_transaction_hash,
            },
            {
                class: { 'wallets-transactions-pending-row__transaction-address': !isMobile },
                hoverMessage: 'View address on Blockchain',
                name: 'Address',
                onInteraction: () =>
                    transaction.address_url
                        ? modal.show(
                              <WalletActionModal
                                  actionButtonsOptions={[
                                      {
                                          isPrimary: true,
                                          onClick: () => window.open(transaction.address_url),
                                          text: 'View',
                                      },
                                  ]}
                                  description='View address on Blockchain.'
                                  title='Transaction details'
                              />,
                              { defaultRootId: 'wallets_modal_root' }
                          )
                        : null,
                ref: addressHashRef,
                shouldShouldHoverMessage: isAddressHashHovered,
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
            isAddressHashHovered,
            isMobile,
            isTransactionHashHovered,
            modal,
            transaction.address_url,
            transaction.formatted_address_hash,
            transaction.formatted_amount,
            transaction.formatted_confirmations,
            transaction.formatted_transaction_hash,
            transaction.is_deposit,
            transaction.submit_date,
            transaction.transaction_url,
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
                        <Tooltip
                            alignment='right'
                            isVisible={!isMobile && !!field.shouldShouldHoverMessage}
                            message={field.hoverMessage || ''}
                        >
                            <WalletText {...{ color: 'red', size: 'xs', weight: 'bold', ...field.valueTextProps }}>
                                <span onClick={isMobile ? field.onInteraction : undefined} ref={field.ref}>
                                    {field.value}
                                </span>
                            </WalletText>
                        </Tooltip>
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
            <div
                className='wallets-transactions-pending-row__transaction-status'
                onClick={
                    isMobile
                        ? () =>
                              modal.show(
                                  <WalletActionModal
                                      actionButtonsOptions={[
                                          {
                                              isPrimary: true,
                                              onClick: modal.hide,
                                              text: 'Ok',
                                          },
                                      ]}
                                      description={transaction.description}
                                      hideCloseButton
                                      title='Transaction details'
                                  />,
                                  { defaultRootId: 'wallets_modal_root' }
                              )
                        : undefined
                }
                ref={statusRef}
            >
                <Tooltip alignment='left' isVisible={!isMobile && isStatusHovered} message={transaction.description}>
                    <div
                        className={classNames(
                            'wallets-transactions-pending-row__transaction-status-dot',
                            `wallets-transactions-pending-row__transaction-status-dot--${transaction.status_code
                                .toLowerCase()
                                .replace('_', '-')}`
                        )}
                    />
                </Tooltip>
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
