import { useEffect, useMemo } from 'react';
import moment from 'moment';
import { useCryptoTransactions } from '@deriv/api';

const useRecentTransactions = () => {
    const { data: transactions, subscribe, ...rest } = useCryptoTransactions();

    useEffect(() => subscribe(), [subscribe]);

    const recentTransactions = useMemo(
        () =>
            transactions?.map(transaction => {
                const isDeposit = transaction.transaction_type === 'deposit';
                const submitDate = transaction.submit_date;
                const confirmations = transaction.confirmations;
                const addressHash = transaction.address_hash;
                const addressHashObscure = addressHash
                    ? `${addressHash.substring(0, 4)}....${addressHash.substring(addressHash.length - 4)}`
                    : 'Pending';
                const transactionHash = transaction.transaction_hash;
                const transactionHashObscure = transactionHash
                    ? `${transactionHash.substring(0, 4)}....${transactionHash.substring(transactionHash.length - 4)}`
                    : 'Pending';

                const depositStatusColorMapper = {
                    CONFIRMED: 'successful',
                    ERROR: 'unsuccessful',
                    PENDING: 'warning',
                } as const;

                const withdrawalStatusColorMapper = {
                    CANCELLED: 'unsuccessful',
                    ERROR: 'unsuccessful',
                    LOCKED: 'warning',
                    PERFORMING_BLOCKCHAIN_TXN: 'warning',
                    PROCESSING: 'warning',
                    REJECTED: 'unsuccessful',
                    REVERTED: 'unsuccessful',
                    REVERTING: 'warning',
                    SENT: 'successful',
                    VERIFIED: 'warning',
                } as const;

                const depositStatusNameMapper = {
                    CONFIRMED: 'Successful',
                    ERROR: 'Unsuccessful',
                    PENDING: 'In process',
                } as const;

                const depositStatusDescriptionMapper = {
                    CONFIRMED: 'Your deposit is successful.',
                    ERROR: 'Your deposit is unsuccessful due to an error on the blockchain. Please contact your crypto wallet service provider for more info.',
                    PENDING: 'We’ve received your request and are waiting for more blockchain confirmations.',
                } as const;

                const withdrawalStatusNameMapper = {
                    CANCELLED: 'Cancelled',
                    ERROR: 'Unsuccessful',
                    LOCKED: 'In review',
                    PERFORMING_BLOCKCHAIN_TXN: 'In process',
                    PROCESSING: 'In process',
                    REJECTED: 'Unsuccessful',
                    REVERTED: 'Unsuccessful',
                    REVERTING: 'In process',
                    SENT: 'Successful',
                    VERIFIED: 'In process',
                } as const;

                const withdrawalStatusDescriptionMapper = {
                    CANCELLED: 'You’ve cancelled your withdrawal request.',
                    ERROR: 'Your withdrawal is unsuccessful due to an error on the blockchain. Please contact us via live chat for more info.',
                    LOCKED: "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
                    PERFORMING_BLOCKCHAIN_TXN: 'We’re sending your request to the blockchain.',
                    PROCESSING: 'We’re awaiting confirmation from the blockchain.',
                    REJECTED: "Your withdrawal is unsuccessful. We've sent you an email with more information.",
                    REVERTED: "Your withdrawal is unsuccessful. We've sent you an email with more information.",
                    REVERTING: "We're processing your withdrawal.",
                    SENT: 'Your withdrawal is successful.',
                    VERIFIED: 'We’re processing your withdrawal.',
                } as const;

                const depositTransactionHashDisplayMapper = {
                    CONFIRMED: transactionHashObscure,
                    ERROR: 'NA',
                    PENDING: transactionHashObscure,
                } as const;

                const withdrawalTransactionHashDisplayMapper = {
                    CANCELLED: 'NA',
                    ERROR: 'NA',
                    LOCKED: transactionHashObscure,
                    PERFORMING_BLOCKCHAIN_TXN: transactionHashObscure,
                    PROCESSING: transactionHashObscure,
                    REJECTED: 'NA',
                    REVERTED: 'NA',
                    REVERTING: 'NA',
                    SENT: transactionHashObscure,
                    VERIFIED: transactionHashObscure,
                } as const;

                const depositConfirmationDisplayMapper = {
                    CONFIRMED: 'Confirmed',
                    ERROR: 'NA',
                    PENDING: confirmations ? `${confirmations}` : 'Pending',
                } as const;

                const withdrawalConfirmationDisplayMapper = {
                    CANCELLED: '-',
                    ERROR: '-',
                    LOCKED: '-',
                    PERFORMING_BLOCKCHAIN_TXN: '-',
                    PROCESSING: '-',
                    REJECTED: '-',
                    REVERTED: '-',
                    REVERTING: '-',
                    SENT: '-',
                    VERIFIED: '-',
                } as const;

                const statusColor = isDeposit
                    ? depositStatusColorMapper[transaction.status_code]
                    : withdrawalStatusColorMapper[transaction.status_code];

                const statusName = isDeposit
                    ? depositStatusNameMapper[transaction.status_code]
                    : withdrawalStatusNameMapper[transaction.status_code];

                const statusDescription = isDeposit
                    ? depositStatusDescriptionMapper[transaction.status_code]
                    : withdrawalStatusDescriptionMapper[transaction.status_code];

                const transactionHashDisplay = isDeposit
                    ? depositTransactionHashDisplayMapper[transaction.status_code]
                    : withdrawalTransactionHashDisplayMapper[transaction.status_code];

                const confirmationDisplay = isDeposit
                    ? depositConfirmationDisplayMapper[transaction.status_code]
                    : withdrawalConfirmationDisplayMapper[transaction.status_code];

                const submitDateDisplay = moment
                    .unix(submitDate || 0)
                    .utc()
                    .format('MMM D, YYYY');

                return {
                    ...transaction,
                    addressHashDisplay: addressHashObscure,
                    confirmationDisplay,
                    isDeposit,
                    statusColor,
                    statusDescription,
                    statusName,
                    submitDateDisplay,
                    transactionHashDisplay,
                };
            }),
        [transactions]
    );

    return { recentTransactions, ...rest };
};

export default useRecentTransactions;
