import React from 'react';
import { act, cleanup, fireEvent, screen, render } from '@testing-library/react';
import { Formik } from 'formik';
import WithdrawalCryptoAmountConverter from '../WithdrawalCryptoAmountConverter';
import { useWithdrawalCryptoContext } from '../../../../../provider';
import { validateCryptoInput, validateFiatInput } from '../../../../../utils';

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
            initialValues={{
                cryptoAddress: '',
                cryptoAmount: '',
                fiatAmount: '',
            }}
            onSubmit={() => {
                return;
            }}
            initialErrors={{}}
        >
            {children}
        </Formik>
    );
};

describe('<WithdrawalCryptoAmountConverter />', () => {
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
            getConvertedCryptoAmount: (fiatInput: string | number) => fiatInput as string,
            getConvertedFiatAmount: (cryptoInput: string | number) => cryptoInput as string,
            isClientVerified: false,
        });
    });

    afterEach(cleanup);

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

    it('should fiat input field should be empty if crypto input field has errors', async () => {
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

    it('should crypto input field should be empty if fiat input field has errors', async () => {
        mockValidateFiatInput.mockReturnValue('Fiat Input Error');

        render(<WithdrawalCryptoAmountConverter />, { wrapper });

        const cryptoInput = screen.getByTestId('dt_withdrawal_crypto_amount_input');
        const fiatInput = screen.getByTestId('dt_withdrawal_fiat_amount_input');
        await act(async () => {
            await fireEvent.change(fiatInput, { target: { value: '10' } });
        });
        expect(cryptoInput).toHaveValue('');
    });
});
