import React from 'react';
import { Formik } from 'formik';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useWithdrawalCryptoContext } from '../../../../../provider';
import { validateCryptoInput, validateFiatInput } from '../../../../../utils';
import WithdrawalCryptoAmountConverter from '../WithdrawalCryptoAmountConverter';

jest.mock('../../../../../utils', () => ({
    ...jest.requireActual('../../../../../utils'),
    validateCryptoInput: jest.fn(),
    validateFiatInput: jest.fn(),
}));

jest.mock('../../../../../provider', () => ({
    ...jest.requireActual('../../../../../provider'),
    useWithdrawalCryptoContext: jest.fn(),
}));

const mockUseWithdrawalCryptoContext = useWithdrawalCryptoContext as jest.MockedFunction<
    typeof useWithdrawalCryptoContext
>;
const mockValidateCryptoInput = validateCryptoInput as jest.Mock;
const mockValidateFiatInput = validateFiatInput as jest.Mock;

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Formik
            initialErrors={{}}
            initialValues={{
                cryptoAddress: '',
                cryptoAmount: '',
                fiatAmount: '',
            }}
            onSubmit={jest.fn()}
        >
            {children}
        </Formik>
    );
};

describe('WithdrawalCryptoAmountConverter', () => {
    beforeEach(() => {
        mockUseWithdrawalCryptoContext.mockReturnValue({
            accountLimits: {
                remainder: undefined,
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeAccount: {
                currency: 'BTC',
            },
            fractionalDigits: {
                crypto: 8,
                fiat: 2,
            },
            getConvertedCryptoAmount: (fiatInput: number | string) => fiatInput as string,
            getConvertedFiatAmount: (cryptoInput: number | string) => cryptoInput as string,
            isClientVerified: false,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display error below crypto input field if crypto input is invalid', async () => {
        mockValidateCryptoInput.mockReturnValue('Crypto Input Error');

        render(<WithdrawalCryptoAmountConverter />, { wrapper });

        const cryptoInput = screen.getByTestId('dt_withdrawal_crypto_amount_input');

        await act(async () => {
            await fireEvent.change(cryptoInput, { target: { value: '10' } });
        });
        expect(screen.getByText('Crypto Input Error')).toBeInTheDocument();
    });

    it('should change value of fiat input field when value of crypto input changes', async () => {
        mockValidateCryptoInput.mockReturnValue('');

        render(<WithdrawalCryptoAmountConverter />, { wrapper });

        const cryptoInput = screen.getByTestId('dt_withdrawal_crypto_amount_input');
        const fiatInput = screen.getByTestId('dt_withdrawal_fiat_amount_input');
        await act(async () => {
            await fireEvent.change(cryptoInput, { target: { value: '10' } });
        });
        expect(fiatInput).toHaveValue('10');
    });

    it('should empty fiat input field if crypto input field has errors', async () => {
        mockValidateCryptoInput.mockReturnValue('Crypto Input Error');

        render(<WithdrawalCryptoAmountConverter />, { wrapper });

        const cryptoInput = screen.getByTestId('dt_withdrawal_crypto_amount_input');
        const fiatInput = screen.getByTestId('dt_withdrawal_fiat_amount_input');
        await act(async () => {
            await fireEvent.change(cryptoInput, { target: { value: '10' } });
        });
        expect(fiatInput).toHaveValue('');
    });

    it('should display error below fiat input field if fiat input is invalid', async () => {
        mockValidateFiatInput.mockReturnValue('Fiat Input Error');

        render(<WithdrawalCryptoAmountConverter />, { wrapper });

        const fiatInput = screen.getByTestId('dt_withdrawal_fiat_amount_input');

        await act(async () => {
            await fireEvent.change(fiatInput, { target: { value: '10' } });
        });
        expect(screen.getByText('Fiat Input Error')).toBeInTheDocument();
    });

    it('should change value of crypto input field when value of fiat input changes', async () => {
        mockValidateFiatInput.mockReturnValue('');

        render(<WithdrawalCryptoAmountConverter />, { wrapper });

        const cryptoInput = screen.getByTestId('dt_withdrawal_crypto_amount_input');
        const fiatInput = screen.getByTestId('dt_withdrawal_fiat_amount_input');
        await act(async () => {
            await fireEvent.change(fiatInput, { target: { value: '10' } });
        });
        expect(cryptoInput).toHaveValue('10');
    });

    it('should empty crypto input field if fiat input field has errors', async () => {
        mockValidateFiatInput.mockReturnValue('Fiat Input Error');

        render(<WithdrawalCryptoAmountConverter />, { wrapper });

        const cryptoInput = screen.getByTestId('dt_withdrawal_crypto_amount_input');
        const fiatInput = screen.getByTestId('dt_withdrawal_fiat_amount_input');
        await act(async () => {
            await fireEvent.change(fiatInput, { target: { value: '10' } });
        });
        expect(cryptoInput).toHaveValue('');
    });

    it('should handle onFocus for crypto input field', async () => {
        render(<WithdrawalCryptoAmountConverter />, { wrapper });

        const cryptoInput = screen.getByTestId('dt_withdrawal_crypto_amount_input');
        await act(async () => {
            await fireEvent.focus(cryptoInput);
        });

        expect(screen.queryByTestId('dt_withdrawal_crypto_amount_converter_arrow')).not.toHaveClass(
            'wallets-withdrawal-crypto-amount-converter__arrow--rtl'
        );
    });

    it('should handle onFocus for fiat input field', async () => {
        render(<WithdrawalCryptoAmountConverter />, { wrapper });

        const fiatInput = screen.getByTestId('dt_withdrawal_fiat_amount_input');
        await act(async () => {
            await fireEvent.focus(fiatInput);
        });

        expect(screen.getByTestId('dt_withdrawal_crypto_amount_converter_arrow')).toHaveClass(
            'wallets-withdrawal-crypto-amount-converter__arrow--rtl'
        );
    });
});
