import { localize } from '@deriv/translations';

const fiat_currencies = ['aud', 'eur', 'gbp', 'usd'];

const crypto_wallets = ['bitcoin', 'ethereum', 'litecoin', 'tether', 'usd_coin'];

const built_in_wallets = ['deriv_p2p', 'payment_agent'];

const e_wallets = [
    { light: 'IcAppstoreWalletAudLight', dark: 'IcAppstoreWalletAudLight' },
    { light: 'IcAppstoreWalletEurLight', dark: 'IcAppstoreWalletEurLight' },
    { light: 'IcAppstoreWalletGbpLight', dark: 'IcAppstoreWalletGbpLight' },
    { light: 'IcAppstoreWalletUsdLight', dark: 'IcAppstoreWalletUsdLight' },
    { light: 'IcAppstoreWalletAudLight', dark: 'IcAppstoreWalletAudLight' },
    { light: 'IcAppstoreWalletEurLight', dark: 'IcAppstoreWalletEurLight' },
    { light: 'IcAppstoreWalletGbpLight', dark: 'IcAppstoreWalletGbpLight' },
    { light: 'IcAppstoreWalletUsdLight', dark: 'IcAppstoreWalletUsdLight' },
    { light: 'IcAppstoreWalletAudLight', dark: 'IcAppstoreWalletAudLight' },
    { light: 'IcAppstoreWalletEurLight', dark: 'IcAppstoreWalletEurLight' },
    { light: 'IcAppstoreWalletGbpLight', dark: 'IcAppstoreWalletGbpLight' },
    { light: 'IcAppstoreWalletUsdLight', dark: 'IcAppstoreWalletUsdLight' },
];

const bankwire = [
    { light: 'IcAppstoreWalletBitcoinLight', dark: 'IcAppstoreWalletBitcoinLight' },
    { light: 'IcAppstoreWalletEthereumLight', dark: 'IcAppstoreWalletEthereumLight' },
    { light: 'IcAppstoreWalletLitecoinLight', dark: 'IcAppstoreWalletLitecoinLight' },
    { light: 'IcAppstoreWalletEusdtLight', dark: 'IcAppstoreWalletEusdtLight' },
    { light: 'IcAppstoreWalletUsdtLight', dark: 'IcAppstoreWalletUsdtLight' },
    { light: 'IcAppstoreWalletUsdcLight', dark: 'IcAppstoreWalletUsdcLight' },
];

const credit_debit_card = [
    { light: 'IcAppstoreWalletP2pLight', dark: 'IcAppstoreWalletP2pLight' },
    { light: 'IcAppstoreWalletPaLight', dark: 'IcAppstoreWalletPaLight' },
];

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
