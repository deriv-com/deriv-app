import React from 'react';
import { Localize, localize } from '@deriv/translations';

const paymentMethodConfig = {
    advcash: {
        icon_light: 'IcAdvcashLight',
        icon_dark: 'IcAdvcashDark',
        instructions: [
            localize('Upload a screenshot of your name and email address from the personal information section.'),
        ],
        input_label: localize('Email address'),
        identifier_type: 'email_address',
    },
    astropay: {
        icon_light: 'IcAstroPayLight',
        icon_dark: 'IcAstroPayDark',
        instructions: [
            <Localize
                key={0}
                i18n_default_text='Upload 2 separate screenshots from the personal details page and the account page via <0>https://app.astropay.com/profile</0>'
                components={[
                    <a
                        key={0}
                        className='link  proof-of-ownership-link'
                        target='_blank'
                        rel='noreferrer'
                        href='https://app.astropay.com/profile'
                    />,
                ]}
            />,
        ],
        input_label: localize('Account number'),
        identifier_type: 'account_number',
    },
    beyonic: {
        icon_light: 'IcBeyonic',
        icon_dark: 'IcBeyonic',
        instructions: [localize('Upload your mobile bill statement showing your name and phone number.')],
        input_label: localize('Mobile number'),
        identifier_type: 'mobile_number',
    },
    'boleto (d24 voucher)': {
        icon_light: 'IcBoletoD24VoucherLight',
        icon_dark: 'IcBoletoD24VoucherDark',
        instructions: [localize('Upload your bank statement showing your name and account details.')],
        input_label: localize('Bank account number'),
        identifier_type: 'bank_account_number',
    },
    visa: {
        icon_light: 'IcVisaLight',
        icon_dark: 'IcVisaDark',
        instructions: [
            localize(
                'Upload a photo showing your name and the first six and last four digits of your card number. If the card does not display your name, upload the bank statement showing your name and card number in the transaction history.'
            ),
        ],
        input_label: localize('Card number'),
        identifier_type: 'card_number',
    },
    mastercard: {
        icon_light: 'IcMasterCardLight',
        icon_dark: 'IcMasterCardDark',
        instructions: [
            localize(
                'Upload a photo showing your name and the first six and last four digits of your card number. If the card does not display your name, upload the bank statement showing your name and card number in the transaction history.'
            ),
        ],
        input_label: localize('Card number'),
        identifier_type: 'card_number',
    },
    pix: {
        icon_light: 'IcPixLight',
        icon_dark: 'IcPixDark',
        instructions: [
            localize('Upload a screenshot of either of the following to process the transaction:'),
            localize('- your account profile section on the website'),
            localize('- the Account Information page on the app'),
            localize('- your account details of the bank linked to your account'),
        ],
        input_label: localize('User ID'),
        identifier_type: 'user_id',
    },
    skrill: {
        icon_light: 'IcSkrillLight',
        icon_dark: 'IcSkrillDark',
        instructions: [
            localize(
                'Upload a screenshot of your name, account number, and email address from the personal details section of the app or profile section of your account on the website.'
            ),
        ],
        input_label: localize('Email address'),
        identifier_type: 'email_address',
    },
    neteller: {
        icon_light: 'IcNetellerLight',
        icon_dark: 'IcNetellerDark',
        instructions: [
            localize(
                'Upload a screenshot of your name, account number, and email address from the personal details section of the app or profile section of your account on the website.'
            ),
        ],
        input_label: localize('Email address'),
        identifier_type: 'email_address',
    },
    onlinenaira: {
        icon_light: 'IcOnlineNaira',
        icon_dark: 'IcOnlineNaira',
        instructions: [
            <Localize
                key={0}
                i18n_default_text='Upload a screenshot of your username on the General Information page at <0>https://onlinenaira.com/members/index.htm</0>'
                components={[
                    <a
                        key={0}
                        className='link proof-of-ownership-link'
                        target='_blank'
                        rel='noreferrer'
                        href='https://onlinenaira.com/members/index.htm'
                    />,
                ]}
            />,
            <Localize
                key={1}
                i18n_default_text='Upload a screenshot of your account number and phone number on the Bank Account/Mobile wallet page at <0>https://onlinenaira.com/members/bank.htm</0>'
                components={[
                    <a
                        key={0}
                        className='link  proof-of-ownership-link'
                        target='_blank'
                        rel='noreferrer'
                        href='https://onlinenaira.com/members/bank.htm'
                    />,
                ]}
            />,
        ],
        input_label: localize('Account ID'),
        identifier_type: 'account_id',
    },
    webmoney: {
        icon_light: 'IcWebMoneyLight',
        icon_dark: 'IcWebMoneyDark',
        instructions: [
            localize(
                'Upload a screenshot of your account and personal details page with your name, account number, phone number, and email address.'
            ),
        ],
        input_label: localize('Account number'),
        identifier_type: 'account_number',
    },
    zingpay: {
        icon_light: 'IcZingpay',
        icon_dark: 'IcZingpay',
        instructions: [
            localize('Upload your bank statement showing your name, account number, and transaction history.'),
        ],
        input_label: localize('Bank account number'),
        identifier_type: 'bank_account_number',
    },
    sticpay: {
        icon_light: 'IcSticpayLight',
        icon_dark: 'IcSticpayDark',
        instructions: [
            localize('Upload a screenshot of your name and email address from the personal details section.'),
        ],
        input_label: localize('Email address'),
        identifier_type: 'email_address',
    },
    jeton: {
        icon_light: 'IcJetonLight',
        icon_dark: 'IcJetonDark',
        instructions: [
            localize('Upload a screenshot of your name and account number from the personal details section.'),
        ],
        input_label: localize('Account number'),
        identifier_type: 'account_number',
    },
    other: {
        icon_light: 'IcOtherPaymentMethod',
        icon_dark: 'IcOtherPaymentMethod',
        instructions: [localize('Upload a document showing your name and bank account number or account details.')],
        input_label: null,
        identifier_type: 'none',
    },
};

export default paymentMethodConfig;
