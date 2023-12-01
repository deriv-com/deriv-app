import { TWithdrawalCryptoContext } from '../provider';

const MIN_ADDRESS_LENGTH = 25;
const MAX_ADDRESS_LENGTH = 64;

const helperMessageMapper = {
    decimalPlacesExceeded: (limit: number) => `Up to ${limit} decimal places are allowed.`,
    insufficientFunds: 'Insufficient funds',
    invalidInput: 'Should be a valid number.',
    withdrawalLimitError: (min: string, max: string) => {
        return `The current allowed withdraw amount is ${min} to ${max}.`;
    },
};

const useWithdrawalCryptoValidator = (
    activeWallet: TWithdrawalCryptoContext['activeWallet'],
    fractionalDigits: TWithdrawalCryptoContext['fractionalDigits']
) => {
    const MINIMUM_WITHDRAWAL_AMOUNT = activeWallet?.currency_config?.minimum_withdrawal;

    const validateCryptoAddress = (address: string) => {
        if (!address) return 'This field is required.';

        if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
            return 'Your wallet address should have 25 to 64 characters.';
        }

        return undefined;
    };

    const validateCryptoInput = (value: string) => {
        if (!value.length) return;

        const amount = parseFloat(parseFloat(value).toFixed(fractionalDigits.crypto));

        if (Number.isNaN(amount)) return helperMessageMapper.invalidInput;

        if (activeWallet?.balance && amount > activeWallet?.balance) return helperMessageMapper.insufficientFunds;

        if (
            MINIMUM_WITHDRAWAL_AMOUNT &&
            activeWallet?.balance &&
            activeWallet.currency &&
            amount < MINIMUM_WITHDRAWAL_AMOUNT
        ) {
            return helperMessageMapper.withdrawalLimitError(
                MINIMUM_WITHDRAWAL_AMOUNT.toFixed(fractionalDigits.crypto),
                activeWallet?.display_balance
            );
        }

        const fractionalPart = value.split('.');
        if (fractionalDigits.crypto && fractionalPart[1] && fractionalPart[1].length > fractionalDigits.crypto)
            return helperMessageMapper.decimalPlacesExceeded(fractionalDigits.crypto);
    };

    const validateFiatInput = (value: string) => {
        if (!value.length) return;

        if (Number.isNaN(parseFloat(value))) return helperMessageMapper.invalidInput;

        const fractionalPart = value.split('.');
        if (fractionalDigits.fiat && fractionalPart[1] && fractionalPart[1].length > fractionalDigits.fiat)
            return helperMessageMapper.decimalPlacesExceeded(fractionalDigits.fiat);
    };

    return {
        validateCryptoAddress,
        validateCryptoInput,
        validateFiatInput,
    };
};

export default useWithdrawalCryptoValidator;
