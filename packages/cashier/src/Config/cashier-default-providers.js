const cash_contents = [
    { title: 'Credit/debit cards', icons: ['IcStockVisa', 'IcStockMasterCard'] },
    {
        title: 'Bank wire',
        icons: [
            'IcWalletZingpayLight',
            'IcCashierNganLoung',
            'IcCashierPayRetailers',
            'IcWalletPaytrustLight',
            'IcCashierHelpToPay',
            'IcCashierDragonPay',
        ],
    },
    {
        title: 'E-wallets',
        icons: [
            'IcWalletSkrillLight',
            'IcWalletNetellerLight',
            'IcWalletSticpayLight',
            'IcCashierAirTm',
            'IcCashierPayLivre',
            'IcWalletFasapayLight',
            'IcWalletJetonLight',
            'IcCashierPerfectMoney',
        ],
    },
];
const crypto_contents = [
    {
        title: 'Cryptos',
        icons: ['IcCashierBitcoin', 'IcCashierEthereum', 'IcCashierLiteCoin', 'IcCashierUsdCoin', 'IcCashierTether'],
    },
    {
        title: 'Buy Cryptos',
        icons: ['IcCashierQrCode', 'IcCashierChangelly', 'IcCashierXanpoolLight', 'IcCashierBanxaLight'],
    },
];
const payment_agent_contents = [
    {
        title: '',
        icons: [
            'IcCashierMandiriPay',
            'IcCashierCimbNiaga',
            'IcCashierBankBri',
            'IcCashierBca',
            'IcCashierEthereum',
            'IcCashierBitcoin',
            'IcCashierTether',
        ],
    },
];
const dp2p_contents = [
    {
        title: '',
        icons: [
            'IcCashierMandiriPay',
            'IcCashierCimbNiaga',
            'IcCashierBankBri',
            'IcCashierBca',
            'IcCashierEthereum',
            'IcCashierBitcoin',
            'IcCashierTether',
        ],
    },
];

const createCashProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description: 'Deposit cash via payment methods available in your country.',
        detail_header: 'Deposit cash',
        detail_contents: cash_contents,
    };
};

const createCryptoProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description: 'Receive crypto to a deposit address, or buy crypto with cash.',
        detail_header: 'Deposit crypto',
        detail_contents: crypto_contents,
    };
};

const createPaymentAgentProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description:
            'Deposit in your local currency via an authorised, independent payment agent in your country.',
        detail_header: 'Deposit via Payment Agent',
        detail_contents: payment_agent_contents,
    };
};

const createDp2pProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description:
            'Deposit in your local currency via peer-to-peer exchange with fellow traders in your country.',
        detail_header: 'Deposit with DP2P',
        detail_contents: dp2p_contents,
    };
};

export default {
    createCashProvider,
    createCryptoProvider,
    createPaymentAgentProvider,
    createDp2pProvider,
};
