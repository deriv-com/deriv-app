import React from 'react';
import {
    useAccountLimits,
    useAccountStatus,
    useActiveWalletAccount,
    useAuthentication,
    useCashierValidation,
} from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WithdrawalLocked from '../WithdrawalLocked';
import getWithdrawalLockedDesc from '../WithdrawalLockedContent';

jest.mock('@deriv/api-v2', () => ({
    useAccountLimits: jest.fn(),
    useAccountStatus: jest.fn(),
    useActiveWalletAccount: jest.fn(),
    useAuthentication: jest.fn(),
    useCashierValidation: jest.fn(),
}));

jest.mock('../WithdrawalLockedContent', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockActiveWalletData = { currency_config: { minimum_withdrawal: 10 } };
const mockAccountLimitsData = { remainder: 20 };
const mockAuthenticationData = {
    is_poa_needed: false,
    is_poi_needed: false,
};
const mockCashierValidationData = {
    ask_authenticate: false,
    ask_financial_risk_approval: false,
    ask_fix_details: false,
    financial_assessment_required: false,
    no_withdrawal_or_trading_status: false,
    withdrawal_locked_status: false,
};
const mockStatusData = { is_withdrawal_locked: false };

describe('WithdrawalLocked', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render locked screen when in a locked state', () => {
        const mockLockedStatusData = { is_withdrawal_locked: true };

        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAccountLimits as jest.Mock).mockReturnValueOnce({ data: mockAccountLimitsData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockLockedStatusData });

        const mockLockedState = { description: 'Locked Description' };
        (getWithdrawalLockedDesc as jest.Mock).mockReturnValueOnce(mockLockedState);

        render(
            <WithdrawalLocked>
                <div>Test Child Component</div>
            </WithdrawalLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();
    });

    it('should render children when not in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAccountLimits as jest.Mock).mockReturnValueOnce({ data: mockAccountLimitsData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockStatusData });

        (getWithdrawalLockedDesc as jest.Mock).mockReturnValueOnce(null);

        render(
            <WithdrawalLocked>
                <div>Test Child Component</div>
            </WithdrawalLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });
});
