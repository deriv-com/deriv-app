import { validateCryptoAddress, validateCryptoInput, validateFiatInput } from '../withdrawalCryptoValidators';
import { THooks } from '../../../../../../types';

describe('withdrawalCryptoValidator', () => {
    let mockValue = '2.5';
    const mockActiveWallet = {
        balance: 10,
        currency: 'BTC',
        currency_config: {
            minimum_withdrawal: 1,
        },
    } as THooks.ActiveWalletAccount;
    const mockFractionalDigits = {
        crypto: 7,
        fiat: 2,
    };
    const mockRemainder = 10_000;
    const mockIsClientVerified = true;
    let mockCryptoAddress = 'jds93e9f8wefun9w8efrn98wefn09inf0';

    it('should check if no errors are returned when valid inputs are provided for crypto address, crypto amount and fiat amount', () => {
        const cryptoAddressMessages = validateCryptoAddress(mockCryptoAddress);

        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        const fiatAmountMessages = validateFiatInput(mockFractionalDigits, mockValue);

        expect(cryptoAddressMessages).toEqual(undefined);
        expect(cryptoAmountMessages).toEqual(undefined);
        expect(fiatAmountMessages).toEqual(undefined);
    });

    it('should return error for invalid crypto address', () => {
        mockCryptoAddress = 'wrfie0493n0';
        let cryptoAddressMessages = validateCryptoAddress(mockCryptoAddress);

        expect(cryptoAddressMessages).toEqual('Your wallet address should have 25 to 64 characters.');

        mockCryptoAddress = 'moie0420349irn039fn09krf0n9r0f9n0r9fkn093nkf09k3n0f9n309fn09rkf09r0f9n93n0';
        cryptoAddressMessages = validateCryptoAddress(mockCryptoAddress);

        expect(cryptoAddressMessages).toEqual('Your wallet address should have 25 to 64 characters.');
    });

    it('should return "Should be a valid number." error for invalid crypto amount and fiat amount', () => {
        mockValue = 'aad';

        let cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        let fiatAmountMessages = validateFiatInput(mockFractionalDigits, mockValue);

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');
        expect(fiatAmountMessages).toEqual('Should be a valid number.');

        mockValue = '5.';

        cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        fiatAmountMessages = validateFiatInput(mockFractionalDigits, mockValue);

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');
        expect(fiatAmountMessages).toEqual('Should be a valid number.');

        mockValue = '.09';

        cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        fiatAmountMessages = validateFiatInput(mockFractionalDigits, mockValue);

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');
        expect(fiatAmountMessages).toEqual('Should be a valid number.');

        mockValue = '5.03abcd';

        cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        fiatAmountMessages = validateFiatInput(mockFractionalDigits, mockValue);

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');
        expect(fiatAmountMessages).toEqual('Should be a valid number.');
    });

    it('should return "Insufficient funds" if amount > balance', () => {
        mockValue = '11.0000000';

        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        expect(cryptoAmountMessages).toEqual('Insufficient funds');
    });
});
