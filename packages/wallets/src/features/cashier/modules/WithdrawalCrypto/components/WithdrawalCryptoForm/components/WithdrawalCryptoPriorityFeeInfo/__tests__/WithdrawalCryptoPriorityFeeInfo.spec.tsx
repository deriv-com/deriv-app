import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { useWithdrawalCryptoContext, WithdrawalCryptoProvider } from '../../../../../provider';
import WithdrawalCryptoPriorityFeeInfo from '../WithdrawalCryptoPriorityFeeInfo';

jest.mock('../../../../../provider', () => ({
    ...jest.requireActual('../../../../../provider'),
    useWithdrawalCryptoContext: jest.fn(),
}));

const mockUseWithdrawalCryptoContext = useWithdrawalCryptoContext as jest.MockedFunction<
    typeof useWithdrawalCryptoContext
>;

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <AuthProvider>
            <WithdrawalCryptoProvider verificationCode='Abcd1234'>{children}</WithdrawalCryptoProvider>
        </AuthProvider>
    </APIProvider>
);

const mockValues = {
    activeWallet: {
        currency: 'BTC',
    },
    countDownEstimationFee: 10,
    cryptoEstimationsFee: 0.0023,
    cryptoEstimationsFeeUniqueId: 'unique_id',
    fractionalDigits: {
        crypto: 8,
        fiat: 2,
    },
};

describe('WithdrawalCryptoPriorityFeeInfo', () => {
    it('should render WithdrawalCryptoPriorityFeeInfo', async () => {
        mockUseWithdrawalCryptoContext.mockReturnValue(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            mockValues
        );

        render(<WithdrawalCryptoPriorityFeeInfo cryptoAmount='123' />, { wrapper });

        expect(screen.getByText('123.00000000 BTC')).toBeInTheDocument();
        expect(screen.getByText('0.00230000 BTC')).toBeInTheDocument();
        expect(screen.getByText('122.99770000 BTC')).toBeInTheDocument();
    });
});
