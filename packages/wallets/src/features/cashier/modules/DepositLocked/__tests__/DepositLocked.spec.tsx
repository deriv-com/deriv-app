import React from 'react';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useAuthentication,
    useCashierValidation,
    useQuery,
    useSettings,
} from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import DepositLocked from '../DepositLocked';
import getDepositLockedDesc from '../DepositLockedContent';

jest.mock('@deriv/api-v2', () => ({
    useAccountStatus: jest.fn(),
    useActiveWalletAccount: jest.fn(),
    useAuthentication: jest.fn(),
    useCashierValidation: jest.fn(),
    useQuery: jest.fn(),
    useSettings: jest.fn(),
}));

jest.mock('../DepositLockedContent', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockActiveWalletData = { currency_config: { minimum_withdrawal: 10 } };
const mockSettingsData = { client_tnc_status: '' };
const mockWebsiteStatusData = { website_status: '' };
const mockAuthenticationData = { is_poa_needed: false, is_poi_needed: false };
const mockCashierValidationData = { ask_fix_details: false, self_exclusion: false, unwelcome_status: false };
const mockStatusData = {
    is_deposit_locked: false,
    is_financial_information_not_complete: false,
    is_trading_experience_not_complete: false,
};

describe('DepositLocked', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render locked screen when in a locked state', () => {
        const mockLockedStatusData = {
            is_deposit_locked: true,
            is_financial_information_not_complete: false,
            is_trading_experience_not_complete: false,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useSettings as jest.Mock).mockReturnValueOnce({ data: mockSettingsData });
        (useQuery as jest.Mock).mockReturnValue({ data: mockWebsiteStatusData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockLockedStatusData });

        const mockLockedState = { description: 'Locked Description' };
        (getDepositLockedDesc as jest.Mock).mockReturnValueOnce(mockLockedState);

        render(
            <DepositLocked>
                <div>Test Child Component</div>
            </DepositLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Deposits into your USD Wallet are temporarily locked.')).toBeInTheDocument();
    });

    it('should render children when not in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useSettings as jest.Mock).mockReturnValueOnce({ data: mockSettingsData });
        (useQuery as jest.Mock).mockReturnValue({ data: mockWebsiteStatusData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockStatusData });

        (getDepositLockedDesc as jest.Mock).mockReturnValueOnce(null);

        render(
            <DepositLocked>
                <div>Test Child Component</div>
            </DepositLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });
});
