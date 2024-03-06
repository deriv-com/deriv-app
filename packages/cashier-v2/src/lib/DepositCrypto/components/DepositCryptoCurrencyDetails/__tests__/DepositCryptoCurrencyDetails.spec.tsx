import React from 'react';
import { useActiveAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import DepositCryptoCurrencyDetails from '../DepositCryptoCurrencyDetails';

jest.mock('@deriv/api-v2', () => ({
    useActiveAccount: jest.fn(),
}));

describe('DepositCryptoCurrencyDetails', () => {
    const mockData = {
        currency_config: {
            display_code: 'BTC',
            name: 'Bitcoin',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with correct currency details', () => {
        (useActiveAccount as jest.Mock).mockReturnValue({ data: mockData });

        render(<DepositCryptoCurrencyDetails />);

        expect(screen.getByText(`Send only Bitcoin (BTC) to this address`)).toBeInTheDocument();
    });
});
