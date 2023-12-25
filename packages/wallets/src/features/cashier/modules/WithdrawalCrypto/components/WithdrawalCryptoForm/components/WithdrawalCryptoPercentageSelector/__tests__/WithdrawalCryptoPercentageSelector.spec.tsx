import React from 'react';
import * as formik from 'formik';
import { render, screen } from '@testing-library/react';
import { useWithdrawalCryptoContext } from '../../../../../provider';
import WithdrawalCryptoPercentageSelector from '../WithdrawalCryptoPercentageSelector';

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

jest.mock('../../../../../provider', () => ({
    ...jest.requireActual('../../../../../provider'),
    useWithdrawalCryptoContext: jest.fn(),
}));

const mockUseWithdrawalCryptoContext = useWithdrawalCryptoContext as jest.Mock;

describe('<WithdrawalCryptoPercentageSelector />', () => {
    it('should show the percentage message when the value is greater than minimum withdrawal balance and less than the maximum withdrawal limit', () => {
        mockUseFormikContext.mockReturnValue({
            values: {
                cryptoAmount: '9.00000000',
            },
        });
        mockUseWithdrawalCryptoContext.mockReturnValue({
            activeWallet: {
                balance: 10,
                currency: 'BTC',
                display_balance: '10.00000000 BTC',
            },
        });

        render(<WithdrawalCryptoPercentageSelector />);
        screen.getByText('90% of available balance (10.00000000 BTC)');
    });
});
