import React from 'react';
import { useAccountStatus, useActiveWalletAccount, useCashierValidation } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import SystemMaintenance from '../SystemMaintenance';
import getSystemMaintenanceContent from '../SystemMaintenanceContent';

jest.mock('@deriv/api-v2', () => ({
    useAccountStatus: jest.fn(),
    useActiveWalletAccount: jest.fn(),
    useCashierValidation: jest.fn(),
}));

jest.mock('../SystemMaintenanceContent', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockActiveWalletData = {
    is_crypto: false,
    is_virtual: false,
};
const mockCashierValidationData = { system_maintenance: false };
const mockStatusData = {
    is_cashier_locked: false,
    is_deposit_locked: false,
    is_withdrawal_locked: false,
};

describe('SystemMaintenance', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render locked screen for cashier locked system maintenance', () => {
        const mockLockedValidationData = { system_maintenance: true };
        const mockLockedStatusData = {
            is_cashier_locked: true,
            is_deposit_locked: false,
            is_withdrawal_locked: false,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        const mockLockedState = { description: 'Locked Description', title: 'Locked Title' };
        (getSystemMaintenanceContent as jest.Mock).mockReturnValue(mockLockedState);

        render(
            <SystemMaintenance>
                <div>Test Child Component</div>
            </SystemMaintenance>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Locked Title')).toBeInTheDocument();
    });

    it('should render locked screen for deposit locked system maintenance', () => {
        const mockLockedValidationData = { system_maintenance: true };
        const mockLockedStatusData = {
            is_cashier_locked: false,
            is_deposit_locked: true,
            is_withdrawal_locked: false,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        const mockLockedState = { description: 'Locked Description', title: 'Locked Title' };
        (getSystemMaintenanceContent as jest.Mock).mockReturnValue(mockLockedState);

        render(
            <SystemMaintenance isDeposit>
                <div>Test Child Component</div>
            </SystemMaintenance>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Locked Title')).toBeInTheDocument();
    });

    it('should render locked screen for withdrawal locked system maintenance', () => {
        const mockLockedValidationData = { system_maintenance: true };
        const mockLockedStatusData = {
            is_cashier_locked: false,
            is_deposit_locked: false,
            is_withdrawal_locked: true,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        const mockLockedState = { description: 'Locked Description', title: 'Locked Title' };
        (getSystemMaintenanceContent as jest.Mock).mockReturnValue(mockLockedState);

        render(
            <SystemMaintenance isWithdrawal>
                <div>Test Child Component</div>
            </SystemMaintenance>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Locked Title')).toBeInTheDocument();
    });

    it('should render children when not in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockStatusData });

        (getSystemMaintenanceContent as jest.Mock).mockReturnValue(null);

        render(
            <SystemMaintenance>
                <div>Test Child Component</div>
            </SystemMaintenance>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });

    it('should render children when no description and title returned from getSystemMaintenanceContent', () => {
        const mockLockedValidationData = { system_maintenance: true };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockStatusData });

        (getSystemMaintenanceContent as jest.Mock).mockReturnValue(null);

        render(
            <SystemMaintenance>
                <div>Test Child Component</div>
            </SystemMaintenance>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });
});
