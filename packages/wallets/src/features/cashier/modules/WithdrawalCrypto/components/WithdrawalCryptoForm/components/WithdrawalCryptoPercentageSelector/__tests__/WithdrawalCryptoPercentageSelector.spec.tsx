import React from 'react';
import * as formik from 'formik';
import { render, screen } from '@testing-library/react';
import { useWithdrawalCryptoContext } from '../../../../../provider';
import WithdrawalCryptoPercentageSelector from '../WithdrawalCryptoPercentageSelector';

jest.mock('../../../../../provider', () => ({
    ...jest.requireActual('../../../../../provider'),
    useWithdrawalCryptoContext: jest.fn(),
}));

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;
const mockUseWithdrawalCryptoContext = useWithdrawalCryptoContext as jest.Mock;

describe('<WithdrawalCryptoPercentageSelector />', () => {
    beforeEach(() => {
        mockUseWithdrawalCryptoContext.mockReturnValue({
            accountLimits: {
                remainder: 0,
            },
            activeWallet: {
                balance: 10,
                currency: 'BTC',
                display_balance: '10.00000000 BTC',
            },
            cryptoConfig: {
                minimum_withdrawal: 1,
            },
            fractionalDigits: {
                crypto: 8,
                fiat: 2,
            },
            isClientVerified: true,
        });
    });

    it('should show the percentage message when the input amount is between min withdrawal limit and max withdrawal limit', () => {
        mockUseFormikContext.mockReturnValue({
            values: {
                cryptoAmount: '9.00000000',
                fiatAmount: '392218.20',
            },
        });

        render(<WithdrawalCryptoPercentageSelector />);
        expect(screen.getByText('90% of available balance (10.00000000 BTC)')).toBeInTheDocument();
    });

    it('should hide the percentage message when the input amount is not between min withdrawal limit and max withdrawal limit', () => {
        mockUseFormikContext.mockReturnValue({
            values: {
                cryptoAmount: '11.00000000',
                fiatAmount: '43,579.80',
            },
        });

        render(<WithdrawalCryptoPercentageSelector />);
        expect(screen.queryByText('90% of available balance (10.00000000 BTC)')).not.toBeInTheDocument();
    });
});
