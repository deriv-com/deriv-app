import React from 'react';
import { useAccountLimits, useActiveWalletAccount } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import WithdrawalLocked from '../WithdrawalLocked';
import withdrawalLockedProvider from '../WithdrawalLockedProvider';

jest.mock('@deriv/api', () => ({
    useAccountLimits: jest.fn(),
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('../WithdrawalLockedProvider', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockActiveWalletData = { currency_config: { minimum_withdrawal: 10 } };
const mockAccountLimitsData = { remainder: 20 };

const mockAccountStatus = {
    authentication: {
        needs_verification: [],
    },
    currency_config: {},
    p2p_poa_required: 1 as const,
    p2p_status: 'none' as const,
    prompt_client_to_authenticate: 1 as const,
    risk_classification: '',
    should_prompt_client_to_authenticate: true,
    status: [],
};

describe('WithdrawalLocked', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render children when not in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAccountLimits as jest.Mock).mockReturnValueOnce({ data: mockAccountLimitsData });

        (withdrawalLockedProvider as jest.Mock).mockReturnValueOnce(null);

        render(
            <WithdrawalLocked accountStatus={mockAccountStatus}>
                <div>Test Child Component</div>
            </WithdrawalLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });

    it('should render locked screen when in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAccountLimits as jest.Mock).mockReturnValueOnce({ data: mockAccountLimitsData });

        const mockLockedState = { description: 'Locked Description', title: 'Locked Title' };
        (withdrawalLockedProvider as jest.Mock).mockReturnValueOnce(mockLockedState);

        render(
            <WithdrawalLocked accountStatus={mockAccountStatus}>
                <div>Test Child Component</div>
            </WithdrawalLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Title')).toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
    });
});
