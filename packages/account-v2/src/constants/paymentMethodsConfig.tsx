/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import {
    DerivLightWalletIcon,
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
    PaymentMethodOnlinenairaBrandIcon,
    PaymentMethodSkrillBrandIcon,
    PaymentMethodSkrillWhiteIcon,
    PaymentMethodSticpayBrandIcon,
    PaymentMethodVisaBrandIcon,
    PaymentMethodVisaWhiteIcon,
    PaymentMethodWebmoneyBrandIcon,
} from '@deriv/quill-icons';

const iconSize = { height: 40, width: 64 };

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
    advCash: {
        icon: {
            dark: <PaymentMethodAdvcashBrandDarkIcon {...iconSize} />,
            light: <PaymentMethodAdvcashBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.email,
        inputLabel: 'Email address',
    },
    astroPay: {
        icon: {
            dark: <PaymentMethodAstropayBrandDarkIcon {...iconSize} />,
            light: <PaymentMethodAstropayBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.accountNumber,
        inputLabel: 'Account number',
    },
    beyonic: {
        icon: {
            dark: <PaymentMethodBeyonicBrandIcon {...iconSize} />,
            light: <PaymentMethodBeyonicBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.mobileNumber,
        inputLabel: 'Mobile number',
    },
    'boleto (d24 voucher)': {
        icon: {
            dark: <PaymentMethodBoletoWhiteIcon {...iconSize} />,
            light: <PaymentMethodBoletoBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.bankAccountNumber,
        inputLabel: 'Bank account number',
    },
    jeton: {
        icon: {
            dark: <PaymentMethodJetonBrandIcon {...iconSize} />,
            light: <PaymentMethodJetonBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.accountNumber,
        inputLabel: 'Account number',
    },
    mastercard: {
        icon: {
            dark: <PaymentMethodMastercardBrandDarkIcon {...iconSize} />,
            light: <PaymentMethodMastercardBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.cardNumber,
        inputLabel: 'Card number',
    },
    neteller: {
        icon: {
            dark: <PaymentMethodNetellerWhiteIcon {...iconSize} />,
            light: <PaymentMethodNetellerBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.email,
        inputLabel: 'Email address',
    },
    onlinenaira: {
        icon: {
            dark: <PaymentMethodOnlinenairaBrandIcon {...iconSize} />,
            light: <PaymentMethodOnlinenairaBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.accountID,
        inputLabel: 'Account ID',
    },
    other: {
        icon: {
            // TODO: Change this icon once actual icon is returned
            dark: <DerivLightWalletIcon {...iconSize} />,
            light: <DerivLightWalletIcon {...iconSize} />,
        },
        identifier: 'none',
        inputLabel: null,
    },
    pix: {
        icon: {
            // TODO: Change this icon once actual icon is returned
            dark: <DerivLightWalletIcon {...iconSize} />,
            light: <DerivLightWalletIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.userID,
        inputLabel: 'User ID',
    },
    skrill: {
        icon: {
            dark: <PaymentMethodSkrillWhiteIcon {...iconSize} />,
            light: <PaymentMethodSkrillBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.email,
        inputLabel: 'Email address',
    },
    sticpay: {
        icon: {
            dark: <PaymentMethodSticpayBrandIcon {...iconSize} />,
            light: <PaymentMethodSticpayBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.email,
        inputLabel: 'Email address',
    },
    visa: {
        icon: {
            dark: <PaymentMethodVisaWhiteIcon {...iconSize} />,
            light: <PaymentMethodVisaBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.cardNumber,
        inputLabel: 'Card number',
    },
    webmoney: {
        icon: {
            dark: <PaymentMethodWebmoneyBrandIcon {...iconSize} />,
            light: <PaymentMethodWebmoneyBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.accountNumber,
        inputLabel: 'Account number',
    },
    zingpay: {
        icon: {
            // TODO: Change this icon once actual icon is returned
            dark: <DerivLightWalletIcon {...iconSize} />,
            light: <DerivLightWalletIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.bankAccountNumber,
        inputLabel: 'Bank account number',
    },
});
