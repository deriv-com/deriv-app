import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import TransferNotAvailable from '../TransferNotAvailable';
import getMessage from '../TransferNotAvailableProvider';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('../TransferNotAvailableProvider', () => jest.fn());

describe('TransferNotAvailable', () => {
    const mockHistory = { push: jest.fn() };
    const mockActiveWallet = { currency: 'USD', is_virtual: false };

    beforeEach(() => {
        (useHistory as jest.Mock).mockReturnValue(mockHistory);
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWallet });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders children when getMessage returns null', () => {
        (getMessage as jest.Mock).mockReturnValue(null);

        render(
            <TransferNotAvailable accounts={[{ balance: '100' }]}>
                <div data-testid='child-component'>Child Component</div>
            </TransferNotAvailable>
        );

        expect(screen.getByTestId('child-component')).toBeInTheDocument();
    });

    it('renders action screen when getMessage returns a state', () => {
        const mockState = {
            actionButton: <button>Action</button>,
            description: 'Test Description',
            title: 'Test Title',
        };
        (getMessage as jest.Mock).mockReturnValue(mockState);

        render(<TransferNotAvailable accounts={[{ balance: '100' }]} />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('calls getMessage with correct parameters', () => {
        render(<TransferNotAvailable accounts={[{ balance: '100' }, { balance: '0' }]} />);

        expect(getMessage).toHaveBeenCalledWith({
            currency: 'USD',
            hasAccountsForTransfer: true,
            hasTransferAccountsWithFunds: true,
            history: mockHistory,
            isVirtual: false,
        });
    });

    it('uses default currency when activeWallet is undefined', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: undefined });

        render(<TransferNotAvailable accounts={[{ balance: '100' }]} />);

        expect(getMessage).toHaveBeenCalledWith(expect.objectContaining({ currency: 'USD' }));
    });
});
