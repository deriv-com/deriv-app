import type { Meta, Story } from '@storybook/react';
import React from 'react';
import { AppWalletModalBodyProps } from '../app-wallet-modal-body';
import AppWalletModal from '../index';

export default {
    title: 'AppWalletModal',
    argTypes: {
        balance: {
            description: 'Sets the wallet balance.',
        },
        currency: {
            description: 'Sets the wallet currency.',
        },
        dark: {
            description: 'If set to `true`, modal will be set to dark theme.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false },
            },
        },
        message: {
            description: 'If set, the message will be displayed on the footer.',
        },
        message_type: {
            control: {
                type: 'select',
                options: ['information', 'warning', 'success', 'error'],
            },
            description: 'Sets the background and icon of the message.',
        },
        wallet_name: {
            control: {
                type: 'select',
                options: [
                    '1Foryou',
                    'Advcash',
                    'Airtm',
                    'Astropay',
                    'Bank wire',
                    'Banxa',
                    'Beyonic',
                    'Bitcoin',
                    'Boleto',
                    'Changelly',
                    'Credit cards',
                    'Demo',
                    'Deriv P2P',
                    'Diners Club',
                    'Ethereum',
                    'Fasapay',
                    'Help2pay',
                    'JCB',
                    'Jeton',
                    'Litecoin',
                    'Maestro',
                    'Mastercard',
                    'Neteller',
                    'Nganluong',
                    'OnlineNaira',
                    'OXXO',
                    'Pay Livre',
                    'Payment agent',
                    'Paysafe card',
                    'Paytrust88',
                    'Perfect Money',
                    'Skrill',
                    'SPEI',
                    'Sticpay',
                    'Tether',
                    'Trustly',
                    'USD Coin',
                    'Visa',
                    'Visa Electron',
                    'WebMoney',
                    'WeChat Pay',
                    'Zingpay',
                ],
            },
            description: 'Sets the wallet logo and background.',
        },
    },
} as Meta<AppWalletModalBodyProps>;

const Template: Story<AppWalletModalBodyProps> = args => {
    return (
        <React.Fragment>
            <AppWalletModal>
                <AppWalletModal.Trigger>
                    <div>Transfer</div>
                </AppWalletModal.Trigger>
                <AppWalletModal.Body {...args} />
            </AppWalletModal>
        </React.Fragment>
    );
};

export const Wallet = Template.bind({});
Wallet.args = {
    balance: '10,0000.00',
    currency: 'USD',
    dark: false,
    message: '',
    message_type: undefined,
    wallet_name: 'Astropay',
};

export const Informative = Template.bind({});
Informative.args = {
    balance: '10,0000.00',
    currency: 'USD',
    dark: false,
    message: 'Message goes here.',
    message_type: 'information',
    wallet_name: 'Banxa',
};

export const Warning = Template.bind({});
Warning.args = {
    balance: '10,0000.00',
    currency: 'USD',
    dark: false,
    message: 'Transfer is temporarily unavailable.',
    message_type: 'warning',
    wallet_name: 'Perfect Money',
};

export const Success = Template.bind({});
Success.args = {
    balance: '10,0000.00',
    currency: 'USD',
    dark: false,
    message: 'Message goes here.',
    message_type: 'success',
    wallet_name: 'OnlineNaira',
};

export const Error = Template.bind({});
Error.args = {
    balance: '10,0000.00',
    currency: 'USD',
    dark: false,
    message: 'Advcash is no longer supported by Deriv.',
    message_type: 'error',
    wallet_name: 'Advcash',
};
