import { localize } from '@deriv/translations';

const fiat_currencies = ['aud', 'eur', 'gbp', 'usd'];

const crypto_wallets = ['bitcoin', 'ethereum', 'litecoin', 'tether', 'usd_coin'];

const built_in_wallets = ['deriv_p2p', 'payment_agent'];

const e_wallets = [
    { light: 'IcCashierAirTmLight', dark: 'IcCashierAirTmDark' },
    { light: 'IcWalletFasapayLight', dark: 'IcWalletFasapayDark' },
    { light: 'IcWalletJetonLight', dark: 'IcWalletJetonDark' },
    { light: 'IcAppstoreBoletoLight', dark: 'IcAppstoreBoletoDark' },
    { light: 'IcWalletNetellerLight', dark: 'IcWalletNetellerDark' },
    { light: 'IcCashierPayLivreLight', dark: 'IcCashierPayLivreDark' },
    { light: 'IcAppstorePaysafeCardLight', dark: 'IcAppstorePaysafeCardDark' },
    { light: 'IcCashierOnlineNairaLight', dark: 'IcCashierOnlineNairaDark' },
    { light: 'IcCashierPerfectMoneyLight', dark: 'IcCashierPerfectMoneyDark' },
    { light: 'IcWalletSkrillLight', dark: 'IcWalletSkrillDark' },
    { light: 'IcWalletSticpayLight', dark: 'IcWalletSticpayDark' },
    { light: 'IcAppstoreAstropayLight', dark: 'IcAppstoreAstropayDark' },
    { light: 'IcAppstoreWechatPayLight', dark: 'IcAppstoreWechatPayDark' },
    { light: 'IcWalletWebmoneyLight', dark: 'IcWalletWebmoneyLight' },
    { light: 'IcAppstoreBeyonicLight', dark: 'IcAppstoreBeyonicDark' },
    { light: 'IcAppstoreOneforyouLight', dark: 'IcAppstoreOneforyouDark' },
    { light: 'IcAppstoreAdvcashLight', dark: 'IcAppstoreAdvcashDark' },
];

const bankwire = [
    { light: 'IcCashierInstantBankTransferLight', dark: 'IcCashierInstantBankTransferDark' },
    { light: 'IcWalletPaytrustLight', dark: 'IcWalletPaytrustDark' },
    { light: 'IcCashierNganLoungLight', dark: 'IcCashierNganLoungDark' },
    { light: 'IcCashierHelpToPayLight', dark: 'IcCashierHelpToPayDark' },
    { light: 'IcWalletZingpayLight', dark: 'IcWalletZingpayDark' },
    { light: 'IcAppstoreTrustlyLight', dark: 'IcAppstoreTrustlyDark' },
    { light: 'IcAppstoreOxxoLight', dark: 'IcAppstoreOxxoDark' },
    { light: 'IcAppstoreSpeiLight', dark: 'IcAppstoreSpeiDark' },
];

const credit_debit_card = [{ light: 'IcWalletCreditDebitLight', dark: 'IcWalletCreditDebitDark' }];

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
