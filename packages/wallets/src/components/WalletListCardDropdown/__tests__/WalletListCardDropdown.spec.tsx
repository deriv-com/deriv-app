import React from 'react';
import { useWalletAccountsList } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import WalletListCardDropdown from '../WalletListCardDropdown';

jest.mock('@deriv/api-v2', () => ({
    useAuthorize: jest.fn(() => ({
        switchAccount: jest.fn(),
    })),
    useWalletAccountsList: jest.fn(() => ({
        data: [
            {
                currency: 'USD',
                display_balance: '1000.00',
                loginid: '1234567',
            },
            {
                currency: 'BTC',
                display_balance: '1.0000000',
                loginid: '7654321',
            },
            {
                currency: 'USD',
                display_balance: '10000.00',
                loginid: '55555',
                wallet_currency_type: 'Demo',
            },
        ],
    })),
}));

describe('WalletListCardDropdown', () => {
    it('should render with the correct data', async () => {
        const onAccountSelectMock = jest.fn();

        render(<WalletListCardDropdown loginid='1234567' onAccountSelect={onAccountSelectMock} />);

        expect(screen.getByDisplayValue('USD Wallet')).toBeInTheDocument();
    });

    it('should switch to selected account on click of the list item', async () => {
        const onAccountSelectMock = jest.fn();

        render(<WalletListCardDropdown loginid='1234567' onAccountSelect={onAccountSelectMock} />);

        expect(screen.getByDisplayValue('USD Wallet')).toBeInTheDocument();

        fireEvent.click(screen.getByDisplayValue('USD Wallet'));
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();
        expect(screen.getByText('USD Demo Wallet')).toBeInTheDocument();
        fireEvent.click(screen.getByText('BTC Wallet'));

        expect(onAccountSelectMock).toHaveBeenCalledWith('7654321');

        fireEvent.click(screen.getByDisplayValue('BTC Wallet'));
        fireEvent.click(screen.getByText('USD Demo Wallet'));

        expect(onAccountSelectMock).toHaveBeenCalledWith('55555');
    });

    it('should render dropdown without crashing when unable to fetch wallets', async () => {
        (useWalletAccountsList as jest.Mock).mockReturnValueOnce({ data: [] });

        render(<WalletListCardDropdown loginid='1234567' onAccountSelect={jest.fn()} />);

        expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });
});
