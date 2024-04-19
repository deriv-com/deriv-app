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
    PaymentMethodPixBrandIcon,
    PaymentMethodPixWhiteIcon,
    PaymentMethodSkrillBrandIcon,
    PaymentMethodSkrillWhiteIcon,
    PaymentMethodSticpayBrandIcon,
    PaymentMethodVisaBrandIcon,
    PaymentMethodVisaWhiteIcon,
    PaymentMethodWebmoneyBrandIcon,
    PaymentMethodZingpayBrandDarkIcon,
    PaymentMethodZingpayBrandIcon,
} from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';

const iconSize = { height: '40px', width: '64px' };

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
        instructions: (
            <Text as='p' size='xs'>
                Upload a screenshot of your name and email address from the personal information section.
            </Text>
        ),
    },
    astroPay: {
        icon: {
            dark: <PaymentMethodAstropayBrandDarkIcon {...iconSize} />,
            light: <PaymentMethodAstropayBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.accountNumber,
        inputLabel: 'Account number',
        instructions: (
            <div>
                <Text size='xs'>
                    Upload 2 separate screenshots from the personal details page and the account page via{' '}
                </Text>
                <a
                    aria-label='Read more on AstroPay'
                    href='https://app.astropay.com/profile'
                    rel='noreferrer'
                    target='_blank'
                >
                    <Text size='xs'>https://app.astropay.com/profile</Text>
                </a>
            </div>
        ),
    },
    beyonic: {
        icon: {
            dark: <PaymentMethodBeyonicBrandIcon {...iconSize} />,
            light: <PaymentMethodBeyonicBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.mobileNumber,
        inputLabel: 'Mobile number',
        instructions: (
            <Text as='p' size='xs'>
                Upload your mobile bill statement showing your name and phone number.
            </Text>
        ),
    },
    'boleto (d24 voucher)': {
        icon: {
            dark: <PaymentMethodBoletoWhiteIcon {...iconSize} />,
            light: <PaymentMethodBoletoBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.bankAccountNumber,
        inputLabel: 'Bank account number',
        instructions: (
            <Text as='p' size='xs'>
                Upload your bank statement showing your name and account details.
            </Text>
        ),
    },
    jeton: {
        icon: {
            dark: <PaymentMethodJetonBrandIcon {...iconSize} />,
            light: <PaymentMethodJetonBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.accountNumber,
        inputLabel: 'Account number',
        instructions: (
            <Text as='p' size='xs'>
                Upload a screenshot of your name and account number from the personal details section.
            </Text>
        ),
    },
    mastercard: {
        icon: {
            dark: <PaymentMethodMastercardBrandDarkIcon {...iconSize} />,
            light: <PaymentMethodMastercardBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.cardNumber,
        inputLabel: 'Card number',
        instructions: (
            <Text as='p' size='xs'>
                Upload a photo showing your name and the first six and last four digits of your card number. If the card
                does not display your name, upload the bank statement showing your name and card number in the
                transaction history.
            </Text>
        ),
    },
    neteller: {
        icon: {
            dark: <PaymentMethodNetellerWhiteIcon {...iconSize} />,
            light: <PaymentMethodNetellerBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.email,
        inputLabel: 'Email address',
        instructions: (
            <Text as='p' size='xs'>
                Upload a screenshot of your name and email address from the personal information section.
            </Text>
        ),
    },
    onlinenaira: {
        icon: {
            dark: <PaymentMethodOnlinenairaBrandIcon {...iconSize} />,
            light: <PaymentMethodOnlinenairaBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.accountID,
        inputLabel: 'Account ID',
        instructions: (
            <ol>
                <Text as='li' size='xs'>
                    <span>Upload a screenshot of your account profile section on the website.</span>
                    <a
                        aria-label='Read more on OnlineNaira'
                        href='https://onlinenaira.com/members/index.htm'
                        rel='noreferrer'
                        target='_blank'
                    >
                        https://onlinenaira.com/members/index.htm
                    </a>
                </Text>
                <Text as='li' size='xs'>
                    <span>
                        Upload a screenshot of your account number and phone number on the Bank Account/Mobile wallet
                        page at
                    </span>
                    <a
                        aria-label='Read more on OnlineNaira'
                        href='https://onlinenaira.com/members/bank.htm'
                        rel='noreferrer'
                        target='_blank'
                    >
                        https://onlinenaira.com/members/bank.htm
                    </a>
                </Text>
            </ol>
        ),
    },
    other: {
        icon: {
            // TODO: Change this icon once actual icon is returned
            dark: <DerivLightWalletIcon {...iconSize} />,
            light: <DerivLightWalletIcon {...iconSize} />,
        },
        identifier: 'none',
        inputLabel: null,
        instructions: (
            <Text as='p' size='xs'>
                Upload a document showing your name and bank account number or account details.
            </Text>
        ),
    },
    pix: {
        icon: {
            dark: <PaymentMethodPixWhiteIcon {...iconSize} />,
            light: <PaymentMethodPixBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.userID,
        inputLabel: 'User ID',
        instructions: (
            <div>
                <Text as='p' size='xs'>
                    Upload a screenshot of either of the following to process the transaction:
                </Text>
                <Text as='p' size='xs'>
                    - your account profile section on the website
                </Text>
                <Text as='p' size='xs'>
                    - the Account Information page on the app
                </Text>
                <Text as='p' size='xs'>
                    - your account details of the bank linked to your account
                </Text>
            </div>
        ),
    },
    skrill: {
        icon: {
            dark: <PaymentMethodSkrillWhiteIcon {...iconSize} />,
            light: <PaymentMethodSkrillBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.email,
        inputLabel: 'Email address',
        instructions: (
            <Text as='p' size='xs'>
                Upload a screenshot of your name, account number, and email address from the personal details section of
                the app or profile section of your account on the website.
            </Text>
        ),
    },
    sticpay: {
        icon: {
            dark: <PaymentMethodSticpayBrandIcon {...iconSize} />,
            light: <PaymentMethodSticpayBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.email,
        inputLabel: 'Email address',
        instructions: (
            <Text as='p' size='xs'>
                Upload a screenshot of your name and email address from the personal details section.
            </Text>
        ),
    },
    visa: {
        icon: {
            dark: <PaymentMethodVisaWhiteIcon {...iconSize} />,
            light: <PaymentMethodVisaBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.cardNumber,
        inputLabel: 'Card number',
        instructions: (
            <Text as='p' size='xs'>
                Upload a photo showing your name and the first six and last four digits of your card number. If the card
                does not display your name, upload the bank statement showing your name and card number in the
                transaction history.
            </Text>
        ),
    },
    webmoney: {
        icon: {
            dark: <PaymentMethodWebmoneyBrandIcon {...iconSize} />,
            light: <PaymentMethodWebmoneyBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.accountNumber,
        inputLabel: 'Account number',
        instructions: (
            <Text as='p' size='xs'>
                Upload a screenshot of your account and personal details page with your name, account number, phone
                number, and email address.
            </Text>
        ),
    },
    zingpay: {
        icon: {
            dark: <PaymentMethodZingpayBrandDarkIcon {...iconSize} />,
            light: <PaymentMethodZingpayBrandIcon {...iconSize} />,
        },
        identifier: PAYMENT_METHOD_IDENTIFIER.bankAccountNumber,
        inputLabel: 'Bank account number',
        instructions: (
            <Text as='p' size='xs'>
                Upload your bank statement showing your name, account number, and transaction history.
            </Text>
        ),
    },
});
