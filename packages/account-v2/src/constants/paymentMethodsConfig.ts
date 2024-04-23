/* eslint-disable sonarjs/no-duplicate-string */
export const PAYMENT_METHOD_IDENTIFIER = Object.freeze({
    accountID: 'account_id',
    accountNumber: 'account_number',
    bankAccountNumber: 'bank_account_number',
    cardNumber: 'card_number',
    email: 'email_address',
    mobileNumber: 'mobile_number',
    userID: 'user_id',
});

export const getPaymentMethodsConfig = () => ({
    advcash: {
        identifier: PAYMENT_METHOD_IDENTIFIER.email,
        inputLabel: 'Email address',
    },
    astropay: {
        identifier: PAYMENT_METHOD_IDENTIFIER.accountNumber,
        inputLabel: 'Account number',
    },
    beyonic: {
        identifier: PAYMENT_METHOD_IDENTIFIER.mobileNumber,
        inputLabel: 'Mobile number',
    },
    'boleto (d24 voucher)': {
        identifier: PAYMENT_METHOD_IDENTIFIER.bankAccountNumber,
        inputLabel: 'Bank account number',
    },
    jeton: {
        identifier: PAYMENT_METHOD_IDENTIFIER.accountNumber,
        inputLabel: 'Account number',
    },
    mastercard: {
        identifier: PAYMENT_METHOD_IDENTIFIER.cardNumber,
        inputLabel: 'Card number',
    },
    neteller: {
        identifier: PAYMENT_METHOD_IDENTIFIER.email,
        inputLabel: 'Email address',
    },
    onlinenaira: {
        identifier: PAYMENT_METHOD_IDENTIFIER.accountID,
        inputLabel: 'Account ID',
    },
    other: {
        identifier: 'none',
        inputLabel: null,
    },
    pix: {
        identifier: PAYMENT_METHOD_IDENTIFIER.userID,
        inputLabel: 'User ID',
    },
    skrill: {
        identifier: PAYMENT_METHOD_IDENTIFIER.email,
        inputLabel: 'Email address',
    },
    sticpay: {
        identifier: PAYMENT_METHOD_IDENTIFIER.email,
        inputLabel: 'Email address',
    },
    visa: {
        identifier: PAYMENT_METHOD_IDENTIFIER.cardNumber,
        inputLabel: 'Card number',
    },
    webmoney: {
        identifier: PAYMENT_METHOD_IDENTIFIER.accountNumber,
        inputLabel: 'Account number',
    },
    zingpay: {
        identifier: PAYMENT_METHOD_IDENTIFIER.bankAccountNumber,
        inputLabel: 'Bank account number',
    },
});
