import { localize } from '@deriv/translations';

const cash_contents = [
    {
        title: localize('Credit/debit cards'),
        icons: [
            { light: 'IcStockVisa', dark: 'IcStockVisaDark' },
            { light: 'IcStockMasterCard', dark: 'IcStockMasterCardDark' },
        ],
    },
    {
        title: localize('Bank wire'),
        icons: [
            { light: 'IcWalletZingpayLight', dark: 'IcWalletZingpayDark' },
            { light: 'IcCashierNganLoungLight', dark: 'IcCashierNganLoungDark' },
            { light: 'IcCashierPayRetailersLight', dark: 'IcCashierPayRetailersDark' },
            { light: 'IcWalletPaytrustLight', dark: 'IcWalletPaytrustDark' },
            { light: 'IcCashierHelpToPayLight', dark: 'IcCashierHelpToPayDark' },
            { light: 'IcCashierDragonPayLight', dark: 'IcCashierDragonPayDark' },
        ],
    },
    {
        title: localize('E-wallets'),
        icons: [
            { light: 'IcWalletSkrillLight', dark: 'IcWalletSkrillDark' },
            { light: 'IcWalletNetellerLight', dark: 'IcWalletNetellerDark' },
            { light: 'IcWalletSticpayLight', dark: 'IcWalletSticpayDark' },
            { light: 'IcCashierAirTmLight', dark: 'IcCashierAirTmDark' },
            { light: 'IcCashierPayLivreLight', dark: 'IcCashierPayLivreDark' },
            { light: 'IcWalletFasapayLight', dark: 'IcWalletFasapayDark' },
            { light: 'IcWalletJetonLight', dark: 'IcWalletJetonDark' },
            { light: 'IcCashierPerfectMoneyLight', dark: 'IcCashierPerfectMoneyDark' },
        ],
    },
];
const crypto_contents = [
    {
        title: localize('Cryptos'),
        icons: [
            { light: 'IcCashierBitcoinLight', dark: 'IcCashierBitcoinDark' },
            { light: 'IcCashierEthereumLight', dark: 'IcCashierEthereumDark' },
            { light: 'IcCashierLiteCoinLight', dark: 'IcCashierLiteCoinDark' },
            { light: 'IcCashierUsdCoinLight', dark: 'IcCashierUsdCoinDark' },
            { light: 'IcCashierTetherLight', dark: 'IcCashierTetherDark' },
        ],
    },
    {
        title: localize('Buy Cryptos'),
        icons: [
            { light: 'IcCashierQrCodeLight', dark: 'IcCashierQrCodeDark' },
            { light: 'IcCashierChangellyLight', dark: 'IcCashierChangellyDark' },
            { light: 'IcCashierXanpoolLight', dark: 'IcCashierXanpoolDark' },
            { light: 'IcCashierBanxaLight', dark: 'IcCashierBanxaDark' },
        ],
    },
];
const payment_agent_contents = [
    {
        title: '',
        icons: [],
    },
];
const dp2p_contents = [
    {
        title: '',
        icons: [],
    },
];

const createCashProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description: localize('Deposit cash via payment methods available in your country.'),
        detail_header: localize('Deposit cash'),
        detail_contents: cash_contents,
    };
};

const createCryptoProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description: localize('Receive crypto to a deposit address, or buy crypto with cash.'),
        detail_header: localize('Deposit crypto'),
        detail_contents: crypto_contents,
    };
};

const createPaymentAgentProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description: localize(
            'Deposit in your local currency via an authorised, independent payment agent in your country.'
        ),
        detail_header: localize('Deposit via Payment Agent'),
        detail_contents: payment_agent_contents,
    };
};

const createDp2pProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description: localize(
            'Deposit in your local currency via peer-to-peer exchange with fellow traders in your country.'
        ),
        detail_header: localize('Deposit with DP2P'),
        detail_contents: dp2p_contents,
    };
};

export default {
    createCashProvider,
    createCryptoProvider,
    createPaymentAgentProvider,
    createDp2pProvider,
};
