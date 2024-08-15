export enum CryptoDepositErrorCodes {
    CryptoConnectionError = 'CryptoConnectionError',
    SuspendedCurrency = 'CryptoSuspendedCurrency',
    SuspendedDeposit = 'CryptoDisabledCurrencyDeposit',
}

export enum CryptoWithdrawalErrorCodes {
    CryptoConnectionError = 'CryptoConnectionError',
    CryptoInvalidAddress = 'CryptoInvalidAddress',
    CryptoLimitAgeVerified = 'CryptoLimitAgeVerified',
    InvalidToken = 'InvalidToken',
    SuspendedCurrency = 'CryptoSuspendedCurrency',
    SuspendedWithdrawal = 'CryptoDisabledCurrencyWithdrawal',
}
