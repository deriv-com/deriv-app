export enum CryptoDepositErrorCodes {
    SuspendedCurrency = 'CryptoSuspendedCurrency',
    SuspendedDeposit = 'CryptoDisabledCurrencyDeposit',
}

export enum CryptoWithdrawalErrorCodes {
    CryptoInvalidAddress = 'CryptoInvalidAddress',
    InvalidToken = 'InvalidToken',
    SuspendedCurrency = 'CryptoSuspendedCurrency',
    SuspendedWithdrawal = 'CryptoDisabledCurrencyWithdrawal',
}
