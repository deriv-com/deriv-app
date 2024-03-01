import React from 'react';
import { useAccountStatus, useActiveWalletAccount, useAuthentication, useCashierValidation } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import CashierLocked from '../CashierLocked';
import getCashierLockedDesc from '../CashierLockedContent';

jest.mock('@deriv/api-v2', () => ({
    useAccountStatus: jest.fn(),
    useActiveWalletAccount: jest.fn(),
    useAuthentication: jest.fn(),
    useCashierValidation: jest.fn(),
}));

jest.mock('../CashierLockedContent', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockActiveWalletData = { currency_config: { minimum_withdrawal: 10 } };
const mockAuthenticationData = { is_poa_needed: false, is_poi_needed: false };
const mockCashierValidationData = { ask_fix_details: false };
const mockStatusData = { is_cashier_locked: false };

describe('CashierLocked', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render locked screen when in a locked state', () => {
        const mockLockedStatusData = { is_cashier_locked: true };
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockLockedStatusData });

        const mockLockedState = { description: 'Locked Description' };
        (getCashierLockedDesc as jest.Mock).mockReturnValueOnce(mockLockedState);

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Your USD Wallet is temporarily locked.')).toBeInTheDocument();
    });

    it('should render children when not in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockStatusData });

        (getCashierLockedDesc as jest.Mock).mockReturnValueOnce(null);

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });
});
