import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useActiveWalletAccount, useCancelCryptoTransaction } from '@deriv/api-v2';
import { LegacyClose1pxIcon } from '@deriv/quill-icons';
import { getTruncatedString } from '@deriv/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Divider, Text, Tooltip } from '@deriv-com/ui';
import { useModal } from '../../../../../../components/ModalProvider';
import { WalletCurrencyCard } from '../../../../../../components/WalletCurrencyCard';
import useDevice from '../../../../../../hooks/useDevice';
import { THooks } from '../../../../../../types';
import { WalletActionModal } from '../../../../components/WalletActionModal';
import {
    getFormattedConfirmations,
    getStatusDescription,
    getStatusName,
} from '../../../../helpers/transaction-helpers';
import { getTransactionLabels } from '../../constants';
import { TransactionsPendingRowField } from './components/TransactionsPendingRowField';
import './TransactionsPendingRow.scss';

type TProps = {
    transaction: THooks.CryptoTransactions;
};

const TransactionsPendingRow: React.FC<TProps> = ({ transaction }) => {
    const { data } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const { localize } = useTranslations();
    const displayCode = useMemo(() => data?.currency_config?.display_code || 'USD', [data]);
    const modal = useModal();
    const formattedTransactionHash = transaction.transaction_hash
        ? getTruncatedString(transaction.transaction_hash, { type: 'middle' })
        : localize('Pending');
    const formattedAddressHash = transaction.address_hash
        ? getTruncatedString(transaction.address_hash, { type: 'middle' })
        : localize('NA');
    const formattedConfirmations = getFormattedConfirmations(transaction.confirmations, transaction.status_code);
    const statusDescription = getStatusDescription(transaction.transaction_type, transaction.status_code);

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
                        text: localize("No, don't cancel"),
                    },
                    {
                        isPrimary: true,
                        onClick: cancelTransaction,
                        text: localize('Yes, cancel'),
                    },
                ]}
                description={localize('Are you sure you want to cancel this transaction?')}
                hideCloseButton
                title={localize('Cancel transaction')}
            />,
            { defaultRootId: 'wallets_modal_root' }
        );
    }, [cancelTransaction, localize, modal]);

    const onMobileStatusClick = useCallback(() => {
        if (isMobile) {
            modal.show(
                <WalletActionModal
                    actionButtonsOptions={[
                        {
                            isPrimary: true,
                            onClick: modal.hide,
                            text: localize('Ok'),
                        },
                    ]}
                    description={statusDescription}
                    hideCloseButton
                    title={localize('Transaction details')}
                />,
                { defaultRootId: 'wallets_modal_root' }
            );
        }
    }, [isMobile, localize, modal, statusDescription]);

    return (
        <React.Fragment>
            <Divider color='var(--border-divider)' />
            <div className='wallets-transactions-pending-row'>
                <div className='wallets-transactions-pending-row__wallet-info'>
                    <WalletCurrencyCard currency={data?.currency || 'USD'} isDemo={data?.is_virtual} size='md' />
                    <div className='wallets-transactions-pending-row__column'>
                        <Text color='primary' size='xs'>
                            {getTransactionLabels()[transaction.transaction_type]}
                        </Text>
                        <Text color='general' size='xs' weight='bold'>
                            {displayCode} Wallet
                        </Text>
                    </div>
                </div>
                <div className='wallets-transactions-pending-row__fields-container'>
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-hash': !isMobile }}
                        hint={
                            transaction.transaction_url
                                ? {
                                      link: transaction.transaction_url,
                                      text: localize('View transaction hash on Blockchain'),
                                      tooltipAlignment: 'right',
                                  }
                                : undefined
                        }
                        name={localize('Transaction hash')}
                        value={formattedTransactionHash}
                    />
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-address': !isMobile }}
                        hint={{
                            link: transaction.address_url,
                            text: localize('View address on Blockchain'),
                            tooltipAlignment: 'right',
                        }}
                        name={localize('Address')}
                        value={formattedAddressHash}
                    />
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-confirmations': !isMobile }}
                        name={localize('Confirmations')}
                        value={formattedConfirmations}
                    />
                    {isMobile && (
                        <React.Fragment>
                            <TransactionsPendingRowField
                                name={localize('Amount')}
                                value={`${transaction.is_deposit ? '+' : '-'}${transaction.formatted_amount}`}
                                valueTextProps={{
                                    color: transaction.is_deposit ? 'success' : 'red',
                                }}
                            />
                            <TransactionsPendingRowField
                                name={localize('Date')}
                                value={moment.unix(transaction.submit_date).format('DD MMM YYYY')}
                                valueTextProps={{
                                    color: 'general',
                                }}
                            />
                        </React.Fragment>
                    )}
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-time': !isMobile }}
                        name={localize('Time')}
                        value={moment
                            .unix(transaction.submit_date)
                            .utc()
                            .format(isMobile ? 'HH:mm:ss [GMT]' : 'DD MMM YYYY HH:mm:ss [GMT]')}
                        valueTextProps={{
                            color: 'general',
                            size: isMobile ? 'xs' : '2xs',
                            weight: isMobile ? 'bold' : 'regular',
                        }}
                    />
                    {!isMobile && (
                        <div className='wallets-transactions-pending-row__transaction-amount'>
                            <Text
                                align='right'
                                color={transaction.is_deposit ? 'success' : 'red'}
                                size='sm'
                                weight='bold'
                            >
                                {transaction.is_deposit ? '+' : '-'}
                                {transaction.formatted_amount}
                            </Text>
                        </div>
                    )}
                </div>
                <div className='wallets-transactions-pending-row__transaction-status'>
                    <Tooltip
                        as='button'
                        className='wallets-transactions-pending-row__transaction-status-button'
                        data-testid='dt_transaction_status_button'
                        hideTooltip={isMobile}
                        onClick={onMobileStatusClick}
                        tooltipContent={statusDescription}
                        tooltipPosition='left'
                    >
                        <div
                            className={classNames(
                                'wallets-transactions-pending-row__transaction-status-dot',
                                `wallets-transactions-pending-row__transaction-status-dot--${transaction.status_code
                                    .toLowerCase()
                                    .replace('_', '-')}`
                            )}
                        />
                        <Text color='general' size='sm'>
                            {getStatusName(transaction.status_code)}
                        </Text>
                    </Tooltip>
                    {!isMobile && !!transaction.is_valid_to_cancel && (
                        <button
                            className='wallets-transactions-pending-row__transaction-cancel-button'
                            onClick={onCancelButtonClick}
                        >
                            <LegacyClose1pxIcon iconSize='xs' />
                        </button>
                    )}
                </div>

                {isMobile && !!transaction.is_valid_to_cancel && (
                    <Button
                        borderWidth='sm'
                        color='black'
                        isFullWidth
                        onClick={onCancelButtonClick}
                        size='sm'
                        variant='outlined'
                    >
                        <Localize i18n_default_text='Cancel transaction' />
                    </Button>
                )}
            </div>
        </React.Fragment>
    );
};

export default TransactionsPendingRow;
