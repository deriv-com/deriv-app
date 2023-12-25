import { TWithdrawalCryptoContext } from '../provider';

const helperMessageMapper = {
    decimalPlacesExceeded: (limit: number) => `Up to ${limit} decimal places are allowed.`,
    insufficientFunds: 'Insufficient funds',
    invalidInput: 'Should be a valid number.',
    withdrawalLimitError: (min: string, max: string) => {
        return `The current allowed withdraw amount is ${min} to ${max}.`;
    },
};

const validateCryptoAddress = (address: string) => {
    const MIN_ADDRESS_LENGTH = 25;
    const MAX_ADDRESS_LENGTH = 64;

    if (!address) return 'This field is required.';

    if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
        return 'Your wallet address should have 25 to 64 characters.';
    }

    return undefined;
};

const validateCryptoInput = (
    remainder: number,
    activeWallet: TWithdrawalCryptoContext['activeWallet'],
    fractionalDigits: TWithdrawalCryptoContext['fractionalDigits'],
    isClientVerified: TWithdrawalCryptoContext['isClientVerified'],
    value: string
) => {
    if (
        !value.length ||
        !activeWallet?.balance ||
        !activeWallet?.currency ||
        !activeWallet?.currency_config ||
        !fractionalDigits.crypto
    )
        return;

    const splitValues = value.split('.');
    const fractionalPart = parseFloat(splitValues[1]);

    const amount = parseFloat(parseFloat(value).toFixed(fractionalDigits.crypto));

    if (Number.isNaN(amount) || splitValues.length > 2 || (fractionalPart && Number.isNaN(fractionalPart)))
        return helperMessageMapper.invalidInput;

    if (amount > activeWallet.balance) return helperMessageMapper.insufficientFunds;

    const MIN_WITHDRAWAL_AMOUNT = activeWallet.currency_config.minimum_withdrawal;

    const MAX_WITHDRAWAL_AMOUNT =
        !isClientVerified && remainder < activeWallet.balance ? remainder : activeWallet.balance;

    if (MIN_WITHDRAWAL_AMOUNT && (amount < MIN_WITHDRAWAL_AMOUNT || amount > MAX_WITHDRAWAL_AMOUNT)) {
        return helperMessageMapper.withdrawalLimitError(
            MIN_WITHDRAWAL_AMOUNT.toFixed(fractionalDigits.crypto),
            `${MAX_WITHDRAWAL_AMOUNT.toFixed(fractionalDigits.crypto)} ${activeWallet.currency}`
        );
    }

    if (fractionalPart && fractionalPart > fractionalDigits.crypto)
        return helperMessageMapper.decimalPlacesExceeded(fractionalDigits.crypto);
};

const validateFiatInput = (
    accountLimits: TWithdrawalCryptoContext['accountLimits'],
    activeWallet: TWithdrawalCryptoContext['activeWallet'],
    fractionalDigits: TWithdrawalCryptoContext['fractionalDigits'],
    value: string
) => {
    if (!value.length) return;

    if (Number.isNaN(parseFloat(value))) return helperMessageMapper.invalidInput;

    const fractionalPart = value.split('.');
    if (fractionalDigits.fiat && fractionalPart[1] && fractionalPart[1].length > fractionalDigits.fiat)
        return helperMessageMapper.decimalPlacesExceeded(fractionalDigits.fiat);
};

export { validateCryptoAddress, validateCryptoInput, validateFiatInput };
