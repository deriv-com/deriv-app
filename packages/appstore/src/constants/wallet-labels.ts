import { localize } from '@deriv/translations';

export const getWalletLabels = (): IWalletLabels => ({
    DEPOSIT: localize('Deposit'),
    GET_WALLET: localize('Get more wallets'),
    RESET: localize('Reset'),
    SETTINGS: localize('Settings'),
    TEMPORARILY_UNAVAILABLE: localize('Deposits and withdrawals temporarily unavailable '),
    TOPUP: localize('Top-up'),
    TRANSACTIONS: localize('Transactions'),
    TRANSFER: localize('Transfer'),
    WITHDRAWAL: localize('Withdrawal'),
});

interface IWalletLabels {
    DEPOSIT: string;
    GET_WALLET: string;
    RESET: string;
    SETTINGS: string;
    TEMPORARILY_UNAVAILABLE: string;
    TOPUP: string;
    TRANSACTIONS: string;
    TRANSFER: string;
    WITHDRAWAL: string;
}
