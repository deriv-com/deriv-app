import React from 'react';
import { useAccountStatus, useActiveWalletAccount, useCashierValidation } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import TransferLocked from '../TransferLocked';

jest.mock('@deriv/api-v2', () => ({
    useAccountStatus: jest.fn(),
    useActiveWalletAccount: jest.fn(),
    useCashierValidation: jest.fn(),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    WalletLoader: () => <div>Loading...</div>,
}));

const mockActiveWalletData = { currency: 'USD', loginid: 'MF42069' };
const mockCashierValidationData = { ask_financial_risk_approval: false };

describe('TransferLocked', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loader when account status is loading', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: null });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: null });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: null, isLoading: true });

        render(
            <TransferLocked>
                <div>Test Child Component</div>
            </TransferLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders locked screen for MF transfer locked', () => {
        const mockLockedStatusData = {
            is_financial_information_not_complete: true,
            is_trading_experience_not_complete: true,
        };
        const mockLockedCashierValidationData = {
            ask_financial_risk_approval: true,
        };

        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        render(
            <TransferLocked>
                <div>Test Child Component</div>
            </TransferLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText(/To enable transfers, you must complete/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment form' })).toBeInTheDocument();
        expect(screen.getByText('Transfers from your USD Wallet are temporarily locked.')).toBeInTheDocument();
    });

    it('renders children when not in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: [] });

        render(
            <TransferLocked>
                <div>Test Child Component</div>
            </TransferLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });
});
