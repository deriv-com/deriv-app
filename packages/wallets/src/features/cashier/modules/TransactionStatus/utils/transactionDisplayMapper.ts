import moment from 'moment';
import { THooks } from '../../../../../types';

const transactionDetailsMapper = (transaction: THooks.CryptoTransactions) => {
    if (transaction.transaction_type === 'deposit') {
        return {
            CONFIRMED: {
                confirmationDisplay: 'Confirmed',
                description: 'Your deposit is successful.',
                statusName: 'Successful',
            },
            ERROR: {
                confirmationDisplay: 'NA',
                description:
                    'Your deposit is unsuccessful due to an error on the blockchain. Please contact your crypto wallet service provider for more info.',
                statusName: 'Unsuccessful',
            },
            PENDING: {
                confirmationDisplay: transaction.confirmations ? `${transaction.confirmations}` : 'Pending',
                description: 'We’ve received your request and are waiting for more blockchain confirmations.',
                statusName: 'In process',
            },
        }[transaction.status_code];
    }

    return {
        CANCELLED: {
            confirmationDisplay: '-',
            description: 'You’ve cancelled your withdrawal request.',
            statusName: 'Cancelled',
        },
        ERROR: {
            confirmationDisplay: '-',
            description:
                'Your withdrawal is unsuccessful due to an error on the blockchain. Please contact us via live chat for more info.',
            statusName: 'Unsuccessful',
        },
        LOCKED: {
            confirmationDisplay: '-',
            description:
                "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
            statusName: 'In review',
        },
        PERFORMING_BLOCKCHAIN_TXN: {
            confirmationDisplay: '-',
            description: 'We’re sending your request to the blockchain.',
            statusName: 'In process',
        },
        PROCESSING: {
            confirmationDisplay: '-',
            description: 'We’re awaiting confirmation from the blockchain.',
            statusName: 'In process',
        },
        REJECTED: {
            confirmationDisplay: '-',
            description: "Your withdrawal is unsuccessful. We've sent you an email with more information.",
            statusName: 'Unsuccessful',
        },
        REVERTED: {
            confirmationDisplay: '-',
            description: "Your withdrawal is unsuccessful. We've sent you an email with more information.",
            statusName: 'Unsuccessful',
        },
        REVERTING: {
            confirmationDisplay: '-',
            description: "We're processing your withdrawal.",
            statusName: 'In process',
        },
        SENT: {
            confirmationDisplay: '-',
            description: 'Your withdrawal is successful.',
            statusName: 'Successful',
        },
        VERIFIED: {
            confirmationDisplay: '-',
            description: 'We’re processing your withdrawal.',
            statusName: 'In process',
        },
    }[transaction.status_code];
};

const transactionDisplayMapper = (transaction: THooks.CryptoTransactions) => {
    const submitDateDisplay = moment
        .unix(transaction.submit_date || 0)
        .utc()
        .format('MMM D, YYYY');
    return {
        ...transaction,
        ...transactionDetailsMapper(transaction),
        submitDateDisplay,
    };
};

export default transactionDisplayMapper;
