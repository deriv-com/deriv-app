import React, { PropsWithChildren } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { CashierLocked } from '../../../modules';
import WalletFiatOnRamp from '../WalletFiatOnRamp';

jest.mock('../../../modules', () => ({
    CashierLocked: jest.fn(({ children }) => <>{children}</>),
    FiatOnRampModule: jest.fn(() => <div>MockedFiatOnRampModule</div>),
    SystemMaintenance: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.Mock;
const mockUseHistory = useHistory as jest.Mock;

const wrapper = ({ children }: PropsWithChildren) => <CashierLocked>{children}</CashierLocked>;

describe('WalletFiatOnRamp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('redirects to /wallet/deposit if onramp is not available for current currency', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                currency_config: {
                    platform: {
                        cashier: ['doughflow'],
                        ramp: [],
                    },
                },
            },
        });

        const pushMock = jest.fn();
        mockUseHistory.mockReturnValue({ push: pushMock });

        render(<WalletFiatOnRamp />, { wrapper });

        expect(pushMock).toHaveBeenCalledWith('/wallet/deposit');
    });

    it('renders FiatOnRampModule when if onramp is available for current currency', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                currency_config: {
                    platform: {
                        cashier: ['crypto'],
                        ramp: ['ramp'],
                    },
                },
            },
        });

        render(<WalletFiatOnRamp />, { wrapper });

        expect(screen.getByText(/MockedFiatOnRampModule/)).toBeInTheDocument();
    });
});
