export const depositStatusColorMapper = {
    CONFIRMED: 'successful',
    ERROR: 'unsuccessful',
    PENDING: 'warning',
} as const;

export const withdrawalStatusColorMapper = {
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

export const depositStatusNameMapper = {
    CONFIRMED: 'Successful',
    ERROR: 'Unsuccessful',
    PENDING: 'In process',
} as const;

export const depositStatusDescriptionMapper = {
    CONFIRMED: 'Your deposit is successful.',
    ERROR: 'Your deposit is unsuccessful due to an error on the blockchain. Please contact your crypto wallet service provider for more info.',
    PENDING: 'We’ve received your request and are waiting for more blockchain confirmations.',
} as const;

export const withdrawalStatusNameMapper = {
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

export const withdrawalStatusDescriptionMapper = {
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

export const withdrawalConfirmationDisplayMapper = {
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

export const depositTransactionHashDisplayMapper = (transactionHashObscure?: string) => ({
    CONFIRMED: transactionHashObscure,
    ERROR: 'NA',
    PENDING: transactionHashObscure,
});

export const withdrawalTransactionHashDisplayMapper = (transactionHashObscure?: string) => ({
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
});

export const depositConfirmationDisplayMapper = (confirmations?: number) => ({
    CONFIRMED: 'Confirmed',
    ERROR: 'NA',
    PENDING: confirmations ? `${confirmations}` : 'Pending',
});
