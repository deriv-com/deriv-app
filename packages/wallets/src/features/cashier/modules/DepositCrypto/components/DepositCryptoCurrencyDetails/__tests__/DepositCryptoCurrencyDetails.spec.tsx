import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import DepositCryptoCurrencyDetails from '../DepositCryptoCurrencyDetails';

jest.mock('@deriv/api-v2');

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
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockData });

        render(<DepositCryptoCurrencyDetails />);

        expect(screen.getByText(`Send only Bitcoin (BTC) to this address`)).toBeInTheDocument();
    });

    it('should not render with currency details when data is unavailable', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({});

        render(<DepositCryptoCurrencyDetails />);

        expect(screen.queryByText('Send only Bitcoin (BTC) to this address')).not.toBeInTheDocument();
    });
});
