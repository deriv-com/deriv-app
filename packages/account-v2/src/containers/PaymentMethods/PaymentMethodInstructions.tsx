import React from 'react';
import { Text } from '@deriv-com/ui';
import { EXTERNAL_LINKS } from 'src/constants';
import { TPaymentMethod } from 'src/types';

type TPaymentMethodInstructionsProps = { paymentMethod: TPaymentMethod };

export const PaymentMethodInstructions = ({ paymentMethod }: TPaymentMethodInstructionsProps) => {
    switch (paymentMethod) {
        case 'advcash':
        case 'neteller': {
            return (
                <Text as='p' size='xs'>
                    Upload a screenshot of your name and email address from the personal information section.
                </Text>
            );
        }
        case 'astropay': {
            return (
                <div>
                    <Text as='p' size='xs'>
                        Upload 2 separate screenshots from the personal details page and the account page via{' '}
                    </Text>
                    <a
                        aria-label='Read more on AstroPay'
                        href={EXTERNAL_LINKS.astroPayURL}
                        rel='noreferrer'
                        target='_blank'
                    >
                        <Text size='xs'>{EXTERNAL_LINKS.astroPayURL}</Text>
                    </a>
                </div>
            );
        }
        case 'beyonic': {
            return (
                <Text as='p' size='xs'>
                    Upload your mobile bill statement showing your name and phone number.
                </Text>
            );
        }
        case 'boleto (d24 voucher)': {
            return (
                <Text as='p' size='xs'>
                    Upload your bank statement showing your name and account details.
                </Text>
            );
        }
        case 'jeton': {
            return (
                <Text as='p' size='xs'>
                    Upload a screenshot of your name and account number from the personal details section.
                </Text>
            );
        }
        case 'mastercard':
        case 'visa': {
            return (
                <Text as='p' size='xs'>
                    Upload a photo showing your name and the first six and last four digits of your card number. If the
                    card does not display your name, upload the bank statement showing your name and card number in the
                    transaction history.
                </Text>
            );
        }
        case 'onlinenaira': {
            return (
                <ol>
                    <Text as='li' size='xs'>
                        <span>Upload a screenshot of your account profile section on the website.</span>
                        <a
                            aria-label='Read more on OnlineNaira'
                            href={EXTERNAL_LINKS.onlinenairaProfileURL}
                            rel='noreferrer'
                            target='_blank'
                        >
                            {EXTERNAL_LINKS.onlinenairaProfileURL}
                        </a>
                    </Text>
                    <Text as='li' size='xs'>
                        <span>
                            Upload a screenshot of your account number and phone number on the Bank Account/Mobile
                            wallet page at
                        </span>
                        <a
                            aria-label='Read more on OnlineNaira'
                            href={EXTERNAL_LINKS.onlinenairaBankURL}
                            rel='noreferrer'
                            target='_blank'
                        >
                            {EXTERNAL_LINKS.onlinenairaBankURL}
                        </a>
                    </Text>
                </ol>
            );
        }
        case 'pix': {
            return (
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
            );
        }
        case 'skrill': {
            return (
                <Text as='p' size='xs'>
                    Upload a screenshot of your name, account number, and email address from the personal details
                    section of the app or profile section of your account on the website.
                </Text>
            );
        }
        case 'sticpay': {
            return (
                <Text as='p' size='xs'>
                    Upload a screenshot of your name and email address from the personal details section.
                </Text>
            );
        }
        case 'webmoney': {
            return (
                <Text as='p' size='xs'>
                    Upload a screenshot of your account and personal details page with your name, account number, phone
                    number, and email address.
                </Text>
            );
        }
        case 'zingpay': {
            return (
                <Text as='p' size='xs'>
                    Upload your bank statement showing your name, account number, and transaction history.
                </Text>
            );
        }
        default: {
            return (
                <Text as='p' size='xs'>
                    Upload a document showing your name and bank account number or account details.
                </Text>
            );
        }
    }
};
