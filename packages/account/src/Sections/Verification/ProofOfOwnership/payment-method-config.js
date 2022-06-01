import { localize } from '@deriv/translations';

const paymentMethodConfig = {
    advcash: {
        icon: 'IcOtherPaymentMethod',
        paragraphs: [
            localize(
                'Upload a screenshot of "Personal Info". Please be sure to capture your full name and your e-mail'
            ),
        ],
        input_label: localize('Email Address'),
        title: 'AdvCash',
        documents_required: 1,
    },
    astropay: {
        icon: 'IcOtherPaymentMethod',
        paragraphs: [localize('Upload screenshots from the "personal details" page and the "account" page')],
        input_label: localize('Account Number'),
        title: 'AstroPay',
        documents_required: 2,
    },
    beyonic: {
        icon: 'IcBeyonic',
        paragraphs: [
            localize(
                'Upload your monthly mobile bill statement or mobile money statement showing your name and mobile number.'
            ),
        ],
        input_label: localize('Account number'),
        title: 'Beyonic',
        documents_required: 1,
    },
    boleto: {
        icon: 'IcOtherPaymentMethod',
        paragraphs: [
            localize('Upload your bank statement that shows your name and account details for the transaction.'),
        ],
        input_label: localize('Account Number'),
        title: 'Boleto (D24 Voucher)',
        documents_required: 1,
    },
    visa: {
        icon: 'IcStockVisa',
        paragraphs: [
            localize(
                'Upload a photo of your card or bank statement showing your name and card number. Your card number must only show the first 6 and last 4 digits.'
            ),
        ],
        input_label: localize('Card Number'),
        title: 'Credit / Debit Card',
        documents_required: 1,
    },
    mastercard: {
        icon: 'IcStockMasterCard',
        paragraphs: [
            localize(
                'Upload a photo of your card or bank statement showing your name and card number. Your card number must only show the first 6 and last 4 digits.'
            ),
        ],
        input_label: localize('Card Number'),
        title: 'Credit / Debit Card',
        documents_required: 1,
    },
    pix: {
        icon: 'IcOtherPaymentMethod',
        paragraphs: [localize('Upload a screenshot of your bank details for the bank linked to Pix')],
        input_label: localize('Account Number'),
        title: 'PIX',
        documents_required: 1,
    },
    paylivre: {
        icon: 'IcCashierPayLivreLight',
        paragraphs: [localize('Upload a screenshot of your profile page')],
        input_label: localize('Email Address'),
        title: 'Paylivre',
        documents_required: 1,
    },
    skrill: {
        icon: 'IcWalletSkrillLight',
        paragraphs: [
            localize(
                'Upload a screenshot of  "Your profile"  or  "Personal details". It should show your name, email and account number'
            ),
        ],
        input_label: localize('Account Number'),
        title: 'Skrill',
        documents_required: 1,
    },
    neteller: {
        icon: 'IcWalletNeteller',
        paragraphs: [
            localize(
                'Upload a screenshot of  "Your profile"  or  "Personal details". It should show your name, email and account number'
            ),
        ],
        input_label: localize('Account Number'),
        title: 'Neteller',
        documents_required: 1,
    },
    onlinenaira: {
        icon: 'IcOnlineNaira',
        paragraphs: [
            localize('Upload the following documents:'),
            localize('1. Upload a screenshot of the General Information page:'),
            localize('2. Upload a screenshot of the Settings page: Showing your Account/Mobile Money details'),
        ],
        input_label: localize('Account ID'),
        title: 'OnlineNaira',
        documents_required: 2,
    },
    webmoney: {
        icon: 'IcWalletWebmoney',
        paragraphs: [
            localize(
                'Upload a screenshot of the "Account" or  "Personal details" page. It should show your name, account number, phone, and email'
            ),
        ],
        input_label: localize('Account Number'),
        title: 'Webmoney',
        documents_required: 1,
    },
    zingpay: {
        icon: 'IcZingpay',
        paragraphs: [localize('Upload your Zingpay bank statement showing your name and bank account number.')],
        input_label: localize('Bank Account Number'),
        title: 'ZingPay',
        documents_required: 1,
    },
    sticpay: {
        icon: 'IcWalletSticpay',
        paragraphs: [localize('Upload a screenshot of your "Personal details". It should show your name and email')],
        input_label: localize('Account Number'),
        title: 'Sticpay',
        documents_required: 1,
    },
    jeton: {
        icon: 'IcWalletJetonLight',
        paragraphs: [
            localize('Upload a screenshot of your "Personal details". It should show your name and account number'),
        ],
        input_label: localize('Account Number'),
        title: 'Jeton',
        documents_required: 1,
    },
    creditdebitcard: {
        icon: 'IcCreditCard',
        paragraphs: [
            localize(
                'Upload a photo of your card or bank statement showing your name and card number. Your card number must only show the first 6 and last 4 digits.'
            ),
        ],
        input_label: localize('Card Number'),
        title: 'Credit / Debit Card',
        documents_required: 2,
    },
    ewallet: {
        icon: 'IcEwallet',
        paragraphs: [
            localize(
                'Upload a screenshot of your e-wallet account details showing your name and account number (or email address). You may upload more than one image.'
            ),
        ],
        input_label: localize('Email Address'),
        title: 'E-wallet',
        documents_required: 1,
    },
    bankwire: {
        icon: 'IcBankTransfer',
        paragraphs: [localize('Upload your bank statement showing your name and bank account number.')],
        input_label: localize('Bank Account Number'),
        title: 'Bank Transfer/Bank Wire',
        documents_required: 1,
    },
    other: {
        icon: 'IcOtherPaymentMethod',
        paragraphs: [localize('Upload a document showing your name and bank account number or account detail.')],
        input_label: null,
        title: '[Payment Method Name]',
        documents_required: 1,
    },
};

export default paymentMethodConfig;
