import moment from 'moment';
import { getTruncatedString } from '@deriv/utils';
import { THooks } from '../../../../../types';

const transactionDetailsMapper = (transaction: THooks.CryptoTransactions) => {
    const transactionHashObscure = transaction.transaction_hash
        ? `${getTruncatedString(transaction.transaction_hash, { length: 8, type: 'middle' })}`
        : 'Pending';

    if (transaction.transaction_type === 'deposit') {
        return {
            CONFIRMED: {
                confirmationDisplay: 'Confirmed',
                description: 'Your deposit is successful.',
                statusColor: 'successful',
                statusName: 'Successful',
                transactionHashDisplay: transactionHashObscure,
            },
            ERROR: {
                confirmationDisplay: 'NA',
                description:
                    'Your deposit is unsuccessful due to an error on the blockchain. Please contact your crypto wallet service provider for more info.',
                statusColor: 'unsuccessful',
                statusName: 'Unsuccessful',
                transactionHashDisplay: 'NA',
            },
            PENDING: {
                confirmationDisplay: transaction.confirmations ? `${transaction.confirmations}` : 'Pending',
                description: 'We’ve received your request and are waiting for more blockchain confirmations.',
                statusColor: 'warning',
                statusName: 'In process',
                transactionHashDisplay: transactionHashObscure,
            },
        }[transaction.status_code];
    }

    return {
        CANCELLED: {
            confirmationDisplay: '-',
            description: 'You’ve cancelled your withdrawal request.',
            statusColor: 'unsuccessful',
            statusName: 'Cancelled',
            transactionHashDisplay: 'NA',
        },
        ERROR: {
            confirmationDisplay: '-',
            description:
                'Your withdrawal is unsuccessful due to an error on the blockchain. Please contact us via live chat for more info.',
            statusColor: 'unsuccessful',
            statusName: 'Unsuccessful',
            transactionHashDisplay: 'NA',
        },
        LOCKED: {
            confirmationDisplay: '-',
            description:
                "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
            statusColor: 'warning',
            statusName: 'In review',
            transactionHashDisplay: transactionHashObscure,
        },
        PERFORMING_BLOCKCHAIN_TXN: {
            confirmationDisplay: '-',
            description: 'We’re sending your request to the blockchain.',
            statusColor: 'warning',
            statusName: 'In process',
            transactionHashDisplay: transactionHashObscure,
        },
        PROCESSING: {
            confirmationDisplay: '-',
            description: 'We’re awaiting confirmation from the blockchain.',
            statusColor: 'warning',
            statusName: 'In process',
            transactionHashDisplay: transactionHashObscure,
        },
        REJECTED: {
            confirmationDisplay: '-',
            description: "Your withdrawal is unsuccessful. We've sent you an email with more information.",
            statusColor: 'unsuccessful',
            statusName: 'Unsuccessful',
            transactionHashDisplay: 'NA',
        },
        REVERTED: {
            confirmationDisplay: '-',
            description: "Your withdrawal is unsuccessful. We've sent you an email with more information.",
            statusColor: 'unsuccessful',
            statusName: 'Unsuccessful',
            transactionHashDisplay: 'NA',
        },
        REVERTING: {
            confirmationDisplay: '-',
            description: "We're processing your withdrawal.",
            statusColor: 'warning',
            statusName: 'In process',
            transactionHashDisplay: 'NA',
        },
        SENT: {
            confirmationDisplay: '-',
            description: 'Your withdrawal is successful.',
            statusColor: 'successful',
            statusName: 'Successful',
            transactionHashDisplay: transactionHashObscure,
        },
        VERIFIED: {
            confirmationDisplay: '-',
            description: 'We’re processing your withdrawal.',
            statusColor: 'warning',
            statusName: 'In process',
            transactionHashDisplay: transactionHashObscure,
        },
    }[transaction.status_code];
};

const transactionDisplayMapper = (transaction: THooks.CryptoTransactions) => {
    const addressHash = transaction.address_hash;
    const addressHashObscure = addressHash
        ? `${getTruncatedString(addressHash, { length: 8, type: 'middle' })}`
        : 'Pending';
    const submitDateDisplay = moment
        .unix(transaction.submit_date || 0)
        .utc()
        .format('MMM D, YYYY');
    return {
        ...transaction,
        ...transactionDetailsMapper(transaction),
        addressHashDisplay: addressHashObscure,
        submitDateDisplay,
    };
};

export default transactionDisplayMapper;
