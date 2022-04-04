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

const fiat_wallets = [
    { getTitle: () => localize('E-wallets'), content: e_wallets, popover_text: () => '' },
    { getTitle: () => localize('Bankwire'), content: bankwire, popover_text: () => '' },
    { getTitle: () => localize('Credit/Debit card'), content: credit_debit_card, popover_text: () => '' },
];

const wallets = [
    {
        getTitle: () => localize('Fiat currency wallets'),
        content: fiat_currencies,
        popover_text: () => localize('***'),
    },
    { getTitle: () => localize('Cryptocurrency wallets'), content: crypto_wallets, popover_text: () => '' },
    {
        getTitle: () => localize('Deriv P2P and Payment agents wallets'),
        content: built_in_wallets,
        popover_text: () => '',
    },
];

export default {
    fiat_wallets,
    wallets,
};
