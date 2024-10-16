import React from 'react';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useCashierValidation,
    usePOA,
    usePOI,
    useSettings,
} from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import DepositLocked from '../DepositLocked';
import getDepositLockedDesc from '../DepositLockedContent';

jest.mock('@deriv/api-v2', () => ({
    useAccountStatus: jest.fn(),
    useActiveWalletAccount: jest.fn(),
    useCashierValidation: jest.fn(),
    usePOA: jest.fn(),
    usePOI: jest.fn(),
    useSettings: jest.fn(),
    useWebsiteStatus: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('../DepositLockedContent', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockSettingsData = { tnc_status: {} };
const mockActiveWalletAccountData = { landing_company_name: 'test' };
const mockPOAData = { has_attempted_poa: false, poa_needs_verification: false };
const mockPOIData = { has_attempted_poi: false, poi_needs_verification: false };
const mockCashierValidationData = { ask_fix_details: false, self_exclusion: false, unwelcome_status: false };
const mockStatusData = {
    is_deposit_locked: false,
    is_financial_information_not_complete: false,
    is_trading_experience_not_complete: false,
};

describe('DepositLocked', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loader when no account status data', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: null });
        (useSettings as jest.Mock).mockReturnValue({ data: null });
        (usePOA as jest.Mock).mockReturnValue({ data: null });
        (usePOI as jest.Mock).mockReturnValue({ data: null });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: null });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: null });

        render(
            <DepositLocked>
                <div>Test Child Component</div>
            </DepositLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders locked screen when in a locked state', () => {
        const mockLockedStatusData = {
            is_deposit_locked: true,
            is_financial_information_not_complete: false,
            is_trading_experience_not_complete: false,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletAccountData });
        (useSettings as jest.Mock).mockReturnValue({ data: mockSettingsData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        (getDepositLockedDesc as jest.Mock).mockReturnValue('Locked Description');

        render(
            <DepositLocked>
                <div>Test Child Component</div>
            </DepositLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Deposits into your USD Wallet are temporarily locked.')).toBeInTheDocument();
    });

    it('renders children when not in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletAccountData });
        (useSettings as jest.Mock).mockReturnValue({ data: mockSettingsData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockStatusData });

        (getDepositLockedDesc as jest.Mock).mockReturnValue(null);

        render(
            <DepositLocked>
                <div>Test Child Component</div>
            </DepositLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });

    it('handles MF account', () => {
        const mockMFAccountData = {
            currency: 'USD',
            excluded_until: '2023-12-31',
            landing_company_name: 'test',
            loginid: 'MF12345',
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockMFAccountData });
        (useSettings as jest.Mock).mockReturnValue({ data: mockSettingsData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { ...mockStatusData, is_deposit_locked: true } });

        (getDepositLockedDesc as jest.Mock).mockReturnValue('MF Account Locked');

        render(
            <DepositLocked>
                <div>Test Child Component</div>
            </DepositLocked>
        );

        expect(screen.getByText('MF Account Locked')).toBeInTheDocument();
    });

    it('handles POA/POI verification needed', () => {
        const mockPOANeededData = {
            ...mockPOAData,
            is_poa_needed: true,
        };
        const mockPOINeededData = {
            ...mockPOIData,
            is_poi_needed: true,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { currency: 'USD', landing_company_name: 'test' },
        });
        (useSettings as jest.Mock).mockReturnValue({ data: mockSettingsData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOANeededData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOINeededData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { ...mockStatusData, is_deposit_locked: true } });

        (getDepositLockedDesc as jest.Mock).mockReturnValue('POI/POA Verification Needed');

        render(
            <DepositLocked>
                <div>Test Child Component</div>
            </DepositLocked>
        );

        expect(screen.getByText('POI/POA Verification Needed')).toBeInTheDocument();
    });

    it('handles financial information and trading experience not complete', () => {
        const mockIncompleteInfoData = {
            ...mockStatusData,
            is_deposit_locked: true,
            is_financial_information_not_complete: true,
            is_trading_experience_not_complete: true,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { currency: 'USD', landing_company_name: 'test' },
        });
        (useSettings as jest.Mock).mockReturnValue({ data: mockSettingsData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockIncompleteInfoData });

        (getDepositLockedDesc as jest.Mock).mockReturnValue('Incomplete Financial Information');

        render(
            <DepositLocked>
                <div>Test Child Component</div>
            </DepositLocked>
        );

        expect(screen.getByText('Incomplete Financial Information')).toBeInTheDocument();
    });
});
