import { localize } from '@deriv/translations';

export type TCashierOnboardingProvider = {
    detail_click: VoidFunction;
    detail_contents?: {
        icons: { light: string; dark: string }[];
    }[];
    detail_description: string;
    detail_header: string;
    is_dark_mode_on?: boolean;
    is_mobile?: boolean;
};

const cash_contents = [
    {
        icons: [
            { light: 'IcWalletCreditDebitLight', dark: 'IcWalletCreditDebitDark' },
            { light: 'IcCashierInstantBankTransferLight', dark: 'IcCashierInstantBankTransferDark' },
            { light: 'IcCashierEwalletLight', dark: 'IcCashierEwalletDark' },
            { light: 'IcCashierLocalPaymentMethodsLight', dark: 'IcCashierLocalPaymentMethodsDark' },
        ],
    },
];
const crypto_contents = [
    {
        icons: [
            { light: 'IcCashierBitcoinLight', dark: 'IcCashierBitcoinDark' },
            { light: 'IcCashierEthereumLight', dark: 'IcCashierEthereumDark' },
            { light: 'IcCashierLiteCoinLight', dark: 'IcCashierLiteCoinDark' },
            { light: 'IcCashierUsdCoinLight', dark: 'IcCashierUsdCoinDark' },
            { light: 'IcCashierTetherLight', dark: 'IcCashierTetherDark' },
        ],
    },
];
const onramp_contents = [
    {
        icons: [{ light: 'IcCashierBanxaLight', dark: 'IcCashierBanxaDark' }],
    },
];

const createCashProvider = (onClick: VoidFunction) => {
    return {
        detail_click: onClick,
        detail_description: localize('Deposit via the following payment methods:'),
        detail_header: localize('Deposit via bank wire, credit card, and e-wallet'),
        detail_contents: cash_contents,
    };
};

const createCryptoProvider = (onClick: VoidFunction) => {
    return {
        detail_click: onClick,
        detail_description: localize('We accept the following cryptocurrencies:'),
        detail_header: localize('Deposit cryptocurrencies'),
        detail_contents: crypto_contents,
    };
};

const createOnrampProvider = (onClick: VoidFunction, is_crypto: boolean) => {
    return {
        detail_click: onClick,
        detail_description: localize('Choose any of these exchanges to buy cryptocurrencies:'),
        detail_header: is_crypto ? localize('Buy cryptocurrencies') : localize('Buy cryptocurrencies via fiat onramp'),
        detail_contents: onramp_contents,
    };
};

const createPaymentAgentProvider = (onClick: VoidFunction) => {
    return {
        detail_click: onClick,
        detail_description: localize(
            'Deposit in your local currency via an authorised, independent payment agent in your country.'
        ),
        detail_header: localize('Deposit via payment agents'),
    };
};

const createDp2pProvider = (onClick: VoidFunction) => {
    return {
        detail_click: onClick,
        detail_description: localize(
            'Deposit with your local currency via peer-to-peer exchange with fellow traders in your country.'
        ),
        detail_header: localize('Deposit with Deriv P2P'),
    };
};

export default {
    createCashProvider,
    createCryptoProvider,
    createDp2pProvider,
    createOnrampProvider,
    createPaymentAgentProvider,
};
