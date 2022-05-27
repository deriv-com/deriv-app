import { localize } from '@deriv/translations';

const paymentMethodConfig = {
    AstroPay: {
        icon: 'IcOtherPaymentMethod',
        paragraphs: [localize('Upload a document showing your name and bank account number or account detail.')],
        input_label: localize('Account number'),
        title: 'AstroPay',
    },
    credit_debit_card: {
        icon: 'IcCreditCard',
        paragraphs: [
            localize(
                'Upload a photo of your card or bank statement showing your name and card number. Your card number must only show the first 6 and last 4 digits.'
            ),
        ],
        input_label: localize('Card number'),
        title: 'Credit / Debit card',
    },
    e_wallet: {
        icon: 'IcEwallet',
        paragraphs: [
            localize(
                'Upload a screenshot of your e-wallet account details showing your name and account number (or email address). You may upload more than one image.'
            ),
        ],
        input_label: localize('Email address'),
        title: 'E-wallet',
    },
    zingPay: {
        icon: 'IcZingpay',
        paragraphs: [localize('Upload your Zingpay bank statement showing your name and bank account number.')],
        input_label: localize('Bank account number'),
        title: 'ZingPay',
    },
    online_naira: {
        icon: 'IcOnlineNaira',
        paragraphs: [
            localize('Upload the following documents:'),
            localize('1. Upload a screenshot of the General Information page:'),
            localize('2. Upload a screenshot of the Settings page:'),
        ],
        input_label: localize('Account ID'),
        title: 'OnlineNaira',
    },
    beyonic: {
        icon: 'IcBeyonic',
        paragraphs: [localize('Upload your mobile phone bill showing your name and mobile number clearly.')],
        input_label: localize('Account number'),
        title: 'Beyonic',
    },
    bank_wire: {
        icon: 'IcBankTransfer',
        paragraphs: [localize('Upload your bank statement showing your name and bank account number.')],
        input_label: localize('Bank account number'),
        title: 'Bank Transfer/Bank Wire',
    },
    other: {
        icon: 'IcOtherPaymentMethod',
        paragraphs: [localize('Upload a document showing your name and bank account number or account detail.')],
        input_label: null,
        title: '[Payment method name]',
    },
};

export default paymentMethodConfig;
