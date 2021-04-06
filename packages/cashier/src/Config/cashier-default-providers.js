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
            { light: 'IcWalletPaytrustLight', dark: 'IcWalletPaytrustDark', size: 64 },
            { light: 'IcCashierHelpToPayLight', dark: 'IcCashierHelpToPayDark', size: 48 },
            { light: 'ic-cashier-dragon-phoenix', dark: 'ic-cashier-dragon-phoenix' },
            { light: 'ic-cashier-online-naira-light', dark: 'ic-cashier-online-naira-dark' },
            { light: 'ic-cashier-directa-light', dark: 'ic-cashier-directa-dark' },
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
            { light: 'IcCashierBitcoinLight', dark: 'IcCashierBitcoinDark', size: 72 },
            { light: 'IcCashierEthereumLight', dark: 'IcCashierEthereumDark', size: 72 },
            { light: 'IcCashierLiteCoinLight', dark: 'IcCashierLiteCoinDark' },
            { light: 'IcCashierUsdCoinLight', dark: 'IcCashierUsdCoinDark', size: 72 },
            { light: 'IcCashierTetherLight', dark: 'IcCashierTetherDark', size: 72 },
        ],
    },
    {
        title: localize('Buy Cryptos'),
        icons: [
            { light: 'IcCashierQrCodeLight', dark: 'IcCashierQrCodeDark', size: 40 },
            { light: 'IcCashierChangellyRowLight', dark: 'IcCashierChangellyRowDark' },
            { light: 'IcCashierXanpoolSmallLight', dark: 'IcCashierXanpoolSmallDark' },
            { light: 'IcCashierBanxaSmallLight', dark: 'IcCashierBanxaSmallDark' },
        ],
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
    };
};

const createDp2pProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description: localize(
            'Deposit in your local currency via peer-to-peer exchange with fellow traders in your country.'
        ),
        detail_header: localize('Deposit with DP2P'),
    };
};

export default {
    createCashProvider,
    createCryptoProvider,
    createPaymentAgentProvider,
    createDp2pProvider,
};
