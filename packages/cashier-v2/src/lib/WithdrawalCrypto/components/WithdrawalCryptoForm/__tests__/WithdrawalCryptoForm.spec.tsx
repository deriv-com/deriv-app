import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useWithdrawalCryptoContext, WithdrawalCryptoProvider } from '../../../provider';
import WithdrawalCryptoForm from '../WithdrawalCryptoForm';
import userEvent from '@testing-library/user-event';

jest.mock('../../../provider', () => ({
    ...jest.requireActual('../../../provider'),
    useWithdrawalCryptoContext: jest.fn(),
    WithdrawalCryptoProvider: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('../../../utils', () => ({
    ...jest.requireActual('../../../utils'),
    validateCryptoAddress: jest.fn(() => {
        return;
    }),
    validateCryptoInput: jest.fn(() => {
        return;
    }),
    validateFiatInput: jest.fn(() => {
        return;
    }),
}));

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    WithdrawalCryptoPercentageSelector: jest.fn(() => <div>WithdrawalCryptoPercentageSelector</div>),
}));

const mockUseWithdrawalCryptoContext = useWithdrawalCryptoContext as jest.MockedFunction<
    typeof useWithdrawalCryptoContext
>;

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <WithdrawalCryptoProvider setVerificationCode={jest.fn()} verificationCode='Abcd1234'>
        {children}
    </WithdrawalCryptoProvider>
);

const mockValues = {
    accountLimits: {
        remainder: undefined,
    },
    activeAccount: {
        currency: 'BTC',
    },
    fractionalDigits: {
        crypto: 8,
        fiat: 2,
    },
    getConvertedCryptoAmount: jest.fn(val => val),
    getConvertedFiatAmount: jest.fn(val => val),
    isClientVerified: false,

    requestCryptoWithdrawal: jest.fn((address, amount) => {}),
};

describe('<WithdrawalCryptoForm />', () => {
    it('should check if requestCryptoWithdrawal was called with correct parameters', async () => {
        mockUseWithdrawalCryptoContext.mockReturnValue(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            mockValues
        );

        render(<WithdrawalCryptoForm />, { wrapper });

        const cryptoAddressInput = screen.getByTestId('dt_withdrawal_crypto_address_input');
        const cryptoAmountInput = screen.getByTestId('dt_withdrawal_crypto_amount_input');
        const submitButton = screen.getByText('Withdraw');

        await act(async () => {
            await userEvent.type(cryptoAddressInput, 'SampleAddress', { delay: 1 });
            userEvent.type(cryptoAmountInput, '123');
            userEvent.click(submitButton);
        });

        expect(mockValues.requestCryptoWithdrawal).toBeCalledWith({ address: 'SampleAddress', amount: 123 });
    });
});
