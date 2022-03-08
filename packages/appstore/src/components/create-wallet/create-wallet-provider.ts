import { localize } from '@deriv/translations';

const fiat_wallets = [
    { light: 'IcAppstoreWalletAudLight', dark: 'IcAppstoreWalletAudLight' },
    { light: 'IcAppstoreWalletEurLight', dark: 'IcAppstoreWalletEurLight' },
    { light: 'IcAppstoreWalletGbpLight', dark: 'IcAppstoreWalletGbpLight' },
    { light: 'IcAppstoreWalletUsdLight', dark: 'IcAppstoreWalletUsdLight' },
];

const crypto_wallets = [
    { light: 'IcAppstoreWalletBitcoinLight', dark: 'IcAppstoreWalletBitcoinLight' },
    { light: 'IcAppstoreWalletEthereumLight', dark: 'IcAppstoreWalletEthereumLight' },
    { light: 'IcAppstoreWalletLitecoinLight', dark: 'IcAppstoreWalletLitecoinLight' },
    { light: 'IcAppstoreWalletEusdtLight', dark: 'IcAppstoreWalletEusdtLight' },
    { light: 'IcAppstoreWalletUsdtLight', dark: 'IcAppstoreWalletUsdtLight' },
    { light: 'IcAppstoreWalletUsdcLight', dark: 'IcAppstoreWalletUsdcLight' },
];

const built_in_wallets = [
    { light: 'IcAppstoreWalletP2pLight', dark: 'IcAppstoreWalletP2pLight' },
    { light: 'IcAppstoreWalletPaLight', dark: 'IcAppstoreWalletPaLight' },
];

const wallets = [
    { title: localize('Fiat currency wallets'), content: fiat_wallets },
    { title: localize('Cryptocurrency wallets'), content: crypto_wallets },
    { title: localize('Deriv P2P and Payment agents wallets'), content: built_in_wallets },
];

export default {
    wallets,
};
