import { localize } from '@deriv/translations';

type TProviderReturnTypes = {
    detail_click: () => void;
    detail_description: string;
    detail_header: string;
    detail_contents?: {
        icons: { light: string; dark: string }[];
    }[];
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
        icons: [
            { light: 'IcCashierChangellyRowLight', dark: 'IcCashierChangellyRowDark' },
            { light: 'IcCashierXanpoolSmallLight', dark: 'IcCashierXanpoolSmallDark' },
            { light: 'IcCashierBanxaLight', dark: 'IcCashierBanxaDark' },
        ],
    },
];

const createCashProvider = (onClick: () => void): TProviderReturnTypes => {
    return {
        detail_click: onClick,
        detail_description: localize('Deposit via the following payment methods:'),
        detail_header: localize('Deposit via bank wire, credit card, and e-wallet'),
        detail_contents: cash_contents,
    };
};

const createCryptoProvider = (onClick: () => void): TProviderReturnTypes => {
    return {
        detail_click: onClick,
        detail_description: localize('We accept the following cryptocurrencies:'),
        detail_header: localize('Deposit cryptocurrencies'),
        detail_contents: crypto_contents,
    };
};

const createOnrampProvider = (onClick: () => void, is_crypto: boolean): TProviderReturnTypes => {
    return {
        detail_click: onClick,
        detail_description: localize('Choose any of these exchanges to buy cryptocurrencies:'),
        detail_header: is_crypto ? localize('Buy cryptocurrencies') : localize('Buy cryptocurrencies via fiat onramp'),
        detail_contents: onramp_contents,
    };
};

const createPaymentAgentProvider = (onClick: () => void): TProviderReturnTypes => {
    return {
        detail_click: onClick,
        detail_description: localize(
            'Deposit in your local currency via an authorised, independent payment agent in your country.'
        ),
        detail_header: localize('Deposit via payment agents'),
    };
};

const createDp2pProvider = (onClick: () => void): TProviderReturnTypes => {
    return {
        detail_click: onClick,
        detail_description: localize(
            'Deposit in your local currency via peer-to-peer exchange with fellow traders in your country.'
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
