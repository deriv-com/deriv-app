import React from 'react';
import { useActiveWalletAccount, useQuery, useSettings } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import DepositLocked from '../DepositLocked';
import depositLockedProvider from '../DepositLockedProvider';

jest.mock('@deriv/api', () => ({
    useActiveWalletAccount: jest.fn(),
    useQuery: jest.fn(),
    useSettings: jest.fn(),
}));

jest.mock('../DepositLockedProvider', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockActiveWalletData = { currency_config: { minimum_withdrawal: 10 } };
const mockSettingsData = { client_tnc_status: '' };
const mockWebsiteStatusData = { website_status: '' };

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

describe('DepositLocked', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render children when not in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useSettings as jest.Mock).mockReturnValueOnce({ data: mockSettingsData });
        (useQuery as jest.Mock).mockReturnValue({ data: mockWebsiteStatusData });

        (depositLockedProvider as jest.Mock).mockReturnValueOnce(null);

        render(
            <DepositLocked accountStatus={mockAccountStatus}>
                <div>Test Child Component</div>
            </DepositLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });

    it('should render locked screen when in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useSettings as jest.Mock).mockReturnValueOnce({ data: mockSettingsData });
        (useQuery as jest.Mock).mockReturnValue({ data: mockWebsiteStatusData });

        const mockLockedState = { description: 'Locked Description', title: 'Locked Title' };
        (depositLockedProvider as jest.Mock).mockReturnValueOnce(mockLockedState);

        render(
            <DepositLocked accountStatus={mockAccountStatus}>
                <div>Test Child Component</div>
            </DepositLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Title')).toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
    });
});
