type CryptoWalletMapping = {
    [key: string]: string;
};

export const crypto_wallets_mapping: CryptoWalletMapping = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    LTC: 'litecoin',
    USDT: 'tether',
    USDC: 'usd_coin',
};

export const built_in_wallets = ['deriv_p2p', 'payment_agent'];

export const e_wallets = [
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

export const bankwire = [
    'InstantBankTransfer',
    'Paytrust88',
    'Nganluong',
    'Help2pay',
    'Zingpay',
    'Trustly',
    'Oxxo',
    'Spei',
];

export const credit_debit_card = ['CreditCards'];
