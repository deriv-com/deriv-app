import { localize } from '@deriv/translations';

const paymentMethodConfig = {
    'Credit / Debit card': {
        icon: 'IcCreditCard',
        instructions: localize(
            'Upload a photo of your card or bank statement showing your name and card number. Your card number must only show the first 6 and last 4 digits.'
        ),
        input_label: localize('Card number'),
    },
    'E-wallet': {
        icon: 'IcEwallet',
        instructions: localize(
            'Upload a screenshot of your e-wallet account details showing your name and account number (or email address). You may upload more than one image.'
        ),
        input_label: localize('Email address'),
    },
    ZingPay: {
        icon: 'IcZingpay',
        instructions: localize('Upload your Zingpay bank statement showing your name and bank account number.'),
        input_label: localize('Bank account number'),
    },
    OnlineNaira: {
        icon: 'IcOnlineNaira',
        instructions: `${localize('Upload the following documents')}:\n
            1. ${localize('Upload a screenshot of the General Information page')}: [link]\n
            2. ${localize('Upload a screenshot of the Settings page')}: [link]\n`,
        input_label: localize('Account ID'),
    },
    Beyonic: {
        icon: 'IcBeyonic',
        instructions: localize('Upload your mobile phone bill showing your name and mobile number clearly.'),
        input_label: localize('Account number'),
    },
    'Bank Transfer/Bank Wire': {
        icon: 'IcBankTransfer',
        instructions: localize('Upload your bank statement showing your name and bank account number.'),
        input_label: localize('Bank account number'),
    },
    other: {
        icon: 'IcOtherPaymentMethod',
        instructions: localize('Upload a document showing your name and bank account number or account detail.'),
        input_label: null,
    },
};

export default paymentMethodConfig;
