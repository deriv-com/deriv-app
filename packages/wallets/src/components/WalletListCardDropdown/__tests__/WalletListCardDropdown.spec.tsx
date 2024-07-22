import React from 'react';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import { TSubscribedBalance } from '../../../types';
import WalletListCardDropdown from '../WalletListCardDropdown';
import '@testing-library/jest-dom';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useWalletAccountsList: jest.fn(),
}));

const mockSwitchAccount = jest.fn();

jest.mock('../../../hooks/useWalletAccountSwitcher', () => ({
    __esModule: true,
    default: jest.fn(() => mockSwitchAccount),
}));

const mockBalanceData: TSubscribedBalance['balance'] = {
    data: {
        accounts: {
            1234567: {
                balance: 1000.0,
                converted_amount: 1000.0,
                currency: 'USD',
                demo_account: 0,
                status: 1,
                type: 'deriv',
            },
            7654321: {
                balance: 1.0,
                converted_amount: 1.0,
                currency: 'BTC',
                demo_account: 1,
                status: 1,
                type: 'deriv',
            },
        },
        balance: 9990,
        currency: 'USD',
        loginid: 'CRW1314',
    },
    error: undefined,
    isIdle: false,
    isLoading: false,
    isSubscribed: false,
};

describe('WalletListCardDropdown', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                loginid: '1234567',
            },
        });
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    currency: 'USD',
                    currency_config: { fractional_digits: 2 },
                    display_balance: '1000.00',
                    is_virtual: false,
                    loginid: '1234567',
                },
                {
                    currency: 'BTC',
                    currency_config: { fractional_digits: 8 },
                    display_balance: '1.0000000',
                    is_virtual: false,
                    loginid: '7654321',
                },
            ],
        });
    });

    it('renders with correct default data', () => {
        render(<WalletListCardDropdown balance={mockBalanceData} />);

        expect(screen.getByDisplayValue('USD Wallet')).toBeInTheDocument();
    });

    it('switches to selected account on click of the list item', () => {
        render(<WalletListCardDropdown balance={mockBalanceData} />);

        const input = screen.getByDisplayValue('USD Wallet');
        fireEvent.click(input);

        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();

        const btcWallet = screen.getByText('BTC Wallet');
        fireEvent.click(btcWallet);

        expect(mockSwitchAccount).toHaveBeenCalledWith('7654321');
        expect(screen.getByDisplayValue('BTC Wallet')).toBeInTheDocument();
    });

    it('displays correct wallet details with balance in items list', () => {
        render(<WalletListCardDropdown balance={mockBalanceData} />);

        const input = screen.getByDisplayValue('USD Wallet');
        fireEvent.click(input);

        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();
        expect(screen.getByText('1.00000000 BTC')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('1,000.00 USD')).toBeInTheDocument();
    });

    it('handles case where no active wallet is set', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: null,
        });

        render(<WalletListCardDropdown balance={mockBalanceData} />);

        expect(screen.queryByDisplayValue('USD Wallet')).not.toBeInTheDocument();
    });

    it('handles case where wallets data is empty', () => {
        (useWalletAccountsList as jest.Mock).mockReturnValue({ data: [] });

        render(<WalletListCardDropdown balance={mockBalanceData} />);

        expect(screen.queryByDisplayValue('USD Wallet')).not.toBeInTheDocument();
    });

    it('closes the dropdown when clicking outside', () => {
        render(<WalletListCardDropdown balance={mockBalanceData} />);

        const input = screen.getByDisplayValue('USD Wallet');
        fireEvent.click(input);

        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();

        fireEvent.mouseDown(document);
        expect(screen.queryByText('BTC Wallet')).not.toBeInTheDocument();
    });

    it('closes the dropdown when pressing the escape key', () => {
        render(<WalletListCardDropdown balance={mockBalanceData} />);

        const input = screen.getByDisplayValue('USD Wallet');
        fireEvent.click(input);

        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByText('BTC Wallet')).not.toBeInTheDocument();
    });
});
