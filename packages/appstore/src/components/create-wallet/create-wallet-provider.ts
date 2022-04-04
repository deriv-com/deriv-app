import { localize } from '@deriv/translations';

const fiat_currencies = ['aud', 'eur', 'gbp', 'usd'];

const crypto_wallets = ['bitcoin', 'ethereum', 'litecoin', 'tether', 'usd_coin'];

const built_in_wallets = ['deriv_p2p', 'payment_agent'];

const e_wallets = [
    'airtm',
    'Fasapay',
    'Jeton',
    'Boleto',
    'Neteller',
    'PayLivre',
    'paysafecard',
    'Onlinenaira',
    'PerfectMoney',
    'Skrill',
    'Sticpay',
    'Astropay',
    'WechatPay',
    'Webmoney',
    'Beyonic',
    '1foryou',
    'Advcash',
];

const bankwire = ['InstantBankTransfer', 'Paytrust88', 'Nganluong', 'Help2pay', 'Zingpay', 'Trustly', 'Oxxo', 'Spei'];

const credit_debit_card = ['CreditCards'];

const wallets_header_info = {
    getTitle: () => localize('Create a wallet'),
    getContent: () => 'Choose a payment method for your wallet.',
};

const fiat_wallets_header_info = {
    getTitle: () => localize('Fiat currency wallets'),
    getContent: () => 'These are all the options you get when choosing fiat wallet.',
};

const fiat_wallets = [
    { getTitle: () => localize('E-wallets'), content: e_wallets },
    { getTitle: () => localize('Bankwire'), content: bankwire },
    { getTitle: () => localize('Credit/Debit card'), content: credit_debit_card },
];

const wallets = [
    { getTitle: () => localize('Fiat currency wallets'), content: fiat_currencies },
    { getTitle: () => localize('Cryptocurrency wallets'), content: crypto_wallets },
    { getTitle: () => localize('Deriv P2P and Payment agents wallets'), content: built_in_wallets },
];

export default {
    fiat_wallets,
    fiat_wallets_header_info,
    wallets,
    wallets_header_info,
};
