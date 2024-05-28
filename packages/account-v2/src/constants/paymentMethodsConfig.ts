import {
    DerivLightWalletIcon,
    IconTypes,
    PaymentMethodAdvcashBrandDarkIcon,
    PaymentMethodAdvcashBrandIcon,
    PaymentMethodAstropayBrandDarkIcon,
    PaymentMethodAstropayBrandIcon,
    PaymentMethodBeyonicBrandIcon,
    PaymentMethodBoletoBrandIcon,
    PaymentMethodBoletoWhiteIcon,
    PaymentMethodJetonBrandIcon,
    PaymentMethodMastercardBrandDarkIcon,
    PaymentMethodMastercardBrandIcon,
    PaymentMethodNetellerBrandIcon,
    PaymentMethodNetellerWhiteIcon,
    PaymentMethodOnlinenairaBrandDarkIcon,
    PaymentMethodOnlinenairaBrandIcon,
    PaymentMethodSkrillBrandIcon,
    PaymentMethodSkrillWhiteIcon,
    PaymentMethodSticpayBrandIcon,
    PaymentMethodVisaBrandIcon,
    PaymentMethodVisaWhiteIcon,
} from '@deriv/quill-icons';
import { TPaymentMethod } from 'src/types';

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

type TPaymentMethodIcon = Record<TPaymentMethod, { dark: IconTypes; light: IconTypes }>;

export const getPaymentMethodIcon = (): TPaymentMethodIcon => ({
    advcash: {
        dark: PaymentMethodAdvcashBrandDarkIcon,
        light: PaymentMethodAdvcashBrandIcon,
    },
    astropay: {
        dark: PaymentMethodAstropayBrandDarkIcon,
        light: PaymentMethodAstropayBrandIcon,
    },
    beyonic: {
        dark: PaymentMethodBeyonicBrandIcon,
        light: PaymentMethodBeyonicBrandIcon,
    },
    'boleto (d24 voucher)': {
        dark: PaymentMethodBoletoWhiteIcon,
        light: PaymentMethodBoletoBrandIcon,
    },
    jeton: {
        dark: PaymentMethodJetonBrandIcon,
        light: PaymentMethodJetonBrandIcon,
    },
    mastercard: {
        dark: PaymentMethodMastercardBrandDarkIcon,
        light: PaymentMethodMastercardBrandIcon,
    },
    neteller: {
        dark: PaymentMethodNetellerWhiteIcon,
        light: PaymentMethodNetellerBrandIcon,
    },
    onlinenaira: {
        dark: PaymentMethodOnlinenairaBrandDarkIcon,
        light: PaymentMethodOnlinenairaBrandIcon,
    },
    other: {
        // TODO: Change this icon once actual icon is available
        dark: DerivLightWalletIcon,
        light: DerivLightWalletIcon,
    },
    pix: {
        // TODO: Change this icon once actual icon is available
        dark: DerivLightWalletIcon,
        light: DerivLightWalletIcon,
    },
    skrill: {
        dark: PaymentMethodSkrillWhiteIcon,
        light: PaymentMethodSkrillBrandIcon,
    },
    sticpay: {
        dark: PaymentMethodSticpayBrandIcon,
        light: PaymentMethodSticpayBrandIcon,
    },
    visa: {
        dark: PaymentMethodVisaWhiteIcon,
        light: PaymentMethodVisaBrandIcon,
    },
    webmoney: {
        // TODO: Change this icon once actual icon is available
        dark: DerivLightWalletIcon,
        light: DerivLightWalletIcon,
    },
    zingpay: {
        // TODO: Change this icon once actual icon is available
        dark: DerivLightWalletIcon,
        light: DerivLightWalletIcon,
    },
});

export const CARD_NUMBER = {
    maxLength: 19,
    minLength: 16,
};

export const MAX_FILE_SIZE = 8000; // 8MB
