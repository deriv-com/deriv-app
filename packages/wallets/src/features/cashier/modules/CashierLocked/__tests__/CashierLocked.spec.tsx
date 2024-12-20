import React from 'react';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useCashierValidation,
    useIsEuRegion,
    usePOA,
    usePOI,
} from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import CashierLocked from '../CashierLocked';
import { getSystemMaintenanceContent } from '../CashierLockedContent';

jest.mock('@deriv/api-v2', () => ({
    useAccountStatus: jest.fn(),
    useActiveWalletAccount: jest.fn(),
    useCashierValidation: jest.fn(),
    useIsEuRegion: jest.fn(),
    usePOA: jest.fn(),
    usePOI: jest.fn(),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    WalletLoader: () => <div>Loading...</div>,
}));

jest.mock('../CashierLockedContent', () => ({
    __esModule: true,
    default: jest.fn(() => 'Locked Description'),
    getSystemMaintenanceContent: jest.fn(() => ({ description: 'Locked Description', title: 'Locked Title' })),
}));

const mockActiveWalletData = { is_crypto: false, is_virtual: false };
const mockPOAData = { is_pending: false, poa_needs_verification: false };
const mockPOIData = { is_pending: false, poi_needs_verification: false };
const mockCashierValidationData = { system_maintenance: false };
const mockStatusData = { is_cashier_locked: false, is_deposit_locked: false, is_withdrawal_locked: false };

describe('CashierLocked', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loader when account status is loading', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: null });
        (usePOA as jest.Mock).mockReturnValue({ data: null });
        (usePOI as jest.Mock).mockReturnValue({ data: null });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: false });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: null });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: null, isLoading: true });

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders loader when is eu region is loading', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: null });
        (usePOA as jest.Mock).mockReturnValue({ data: null });
        (usePOI as jest.Mock).mockReturnValue({ data: null });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: null, isLoading: true });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: null });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: null });

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders locked screen for cashier locked system maintenance', () => {
        const mockLockedValidationData = { system_maintenance: true };
        const mockLockedStatusData = {
            is_cashier_locked: true,
            is_deposit_locked: false,
            is_withdrawal_locked: false,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: false });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Locked Title')).toBeInTheDocument();
    });

    it('renders locked screen for deposit locked system maintenance', () => {
        const mockLockedValidationData = { system_maintenance: true };
        const mockLockedStatusData = {
            is_cashier_locked: false,
            is_deposit_locked: true,
            is_withdrawal_locked: false,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: false });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        render(
            <CashierLocked module='deposit'>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Locked Title')).toBeInTheDocument();
    });

    it('renders locked screen for withdrawal locked system maintenance', () => {
        const mockLockedValidationData = { system_maintenance: true };
        const mockLockedStatusData = {
            is_cashier_locked: false,
            is_deposit_locked: false,
            is_withdrawal_locked: true,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: false });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        render(
            <CashierLocked module='withdrawal'>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Locked Title')).toBeInTheDocument();
    });

    it('renders locked screen for cashier locked', () => {
        const mockLockedStatusData = { is_cashier_locked: true, is_deposit_locked: false, is_withdrawal_locked: false };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: false });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Your USD Wallet is temporarily locked.')).toBeInTheDocument();
    });

    it('renders locked screen for crypto wallet', () => {
        const mockCryptoWalletData = { ...mockActiveWalletData, currency: 'BTC', is_crypto: true };
        const mockLockedStatusData = { is_cashier_locked: true, is_deposit_locked: false, is_withdrawal_locked: false };

        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockCryptoWalletData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: false });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Your BTC Wallet is temporarily locked.')).toBeInTheDocument();
    });

    it('renders children when not in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: false });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockStatusData });

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });

    it('renders children for virtual account', () => {
        const mockVirtualWalletData = { ...mockActiveWalletData, is_virtual: true };
        const mockLockedValidationData = { system_maintenance: true };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockVirtualWalletData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: false });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockStatusData });

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });

    it('renders children when no description and title returned from getSystemMaintenanceContent', () => {
        const mockLockedValidationData = { system_maintenance: true };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (usePOA as jest.Mock).mockReturnValue({ data: mockPOAData });
        (usePOI as jest.Mock).mockReturnValue({ data: mockPOIData });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: false });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockStatusData });

        (getSystemMaintenanceContent as jest.Mock).mockReturnValue(null);

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });
});
