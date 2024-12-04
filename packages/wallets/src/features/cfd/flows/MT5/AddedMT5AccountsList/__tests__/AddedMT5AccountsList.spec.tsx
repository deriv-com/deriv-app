import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from '../../../../../../components/ModalProvider';
import { MT5_ACCOUNT_STATUS, PlatformDetails } from '../../../../constants';
import AddedMT5AccountsList from '../AddedMT5AccountsList';
import { useAddedMT5Account } from '../hooks';

// mock function to check if correct props are passed to the modal components
const mockPropsFn = jest.fn();

jest.mock('../hooks', () => ({
    useAddedMT5Account: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

jest.mock('../../../../components', () => ({
    ...jest.requireActual('../../../../components'),
    PlatformStatusBadge: jest.fn(props => {
        mockPropsFn(props);
        return <div>PlatformStatusBadge</div>;
    }),
}));

jest.mock('../../../../modals', () => ({
    ...jest.requireActual('../../../../modals'),
    MT5TradeModal: jest.fn(props => {
        mockPropsFn(props);
        return <div>MT5TradeModal</div>;
    }),
    TradingPlatformStatusModal: jest.fn(props => {
        mockPropsFn(props);
        return <div>TradingPlatformStatusModal</div>;
    }),
}));

jest.mock('../../../../../../components', () => ({
    ...jest.requireActual('../../../../../../components'),
    ClientVerificationModal: jest.fn(props => {
        mockPropsFn(props);
        return <div>ClientVerificationModal</div>;
    }),
    ClientVerificationStatusBadge: jest.fn(props => {
        mockPropsFn(props.variant);
        return (
            <div
                onClick={e => {
                    e.stopPropagation();
                    props.onClick();
                }}
            >
                ClientVerificationStatusBadge
            </div>
        );
    }),
    WalletDisabledAccountModal: jest.fn(props => {
        mockPropsFn(props);
        return <div>WalletDisabledAccountModal</div>;
    }),
    WalletStatusBadge: jest.fn(props => {
        mockPropsFn(props);
        return <div>WalletStatusBadge</div>;
    }),
}));

const mockAccount = {
    display_balance: 'USD 1000.00',
    display_login: '12345678',
    landing_company_short: 'svg',
    market_type: 'financial',
    platform: 'mt5',
    product: 'financial',
    status: 'active',
};

const mockUseAddedMT5AccountData = {
    accountDetails: {
        icon: (
            <>
                icon-{mockAccount.platform}-{mockAccount.product}
            </>
        ),
        title: 'Financial',
    },
    hasDisabledPlatformStatus: false,
    showMT5TradeModal: true,
};

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => <ModalProvider>{children}</ModalProvider>;

describe('AddedMT5AccountsList', () => {
    // const mockShow = jest.fn();

    beforeAll(() => {
        const modalRoot = document.createElement('div');
        modalRoot.setAttribute('id', 'wallets_modal_root');
        document.body.appendChild(modalRoot);
    });
    beforeEach(() => {
        (useAddedMT5Account as jest.Mock).mockReturnValue(mockUseAddedMT5AccountData);
    });

    it('displays added mt5 account with correct account details', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />, { wrapper });

        expect(screen.getByText('icon-mt5-financial')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('USD 1000.00')).toBeInTheDocument();
        expect(screen.getByText('12345678')).toBeInTheDocument();
    });

    it('displays correct variant of ClientVerificationStatusBadge and renders modal with ClientVerificationModal when clicked on it', async () => {
        (useAddedMT5Account as jest.Mock).mockReturnValue({
            ...mockUseAddedMT5AccountData,
            kycStatus: 'mockKycStatus',
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />, { wrapper });

        const badge = screen.getByText('ClientVerificationStatusBadge');

        expect(badge).toBeInTheDocument();
        expect(mockPropsFn).toBeCalledWith('mockKycStatus');

        await userEvent.click(badge);

        await waitFor(() => {
            expect(screen.getByText('ClientVerificationModal')).toBeInTheDocument();
        });
    });

    it('shows the disabled badge when the account MT5 account is disabled', () => {
        (useAddedMT5Account as jest.Mock).mockReturnValue({
            ...mockUseAddedMT5AccountData,
            hasDisabledPlatformStatus: true,
            isAccountDisabled: true,
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />, { wrapper });

        expect(screen.getByText('WalletStatusBadge')).toBeInTheDocument();
        expect(mockPropsFn).toBeCalledWith({
            badgeSize: 'md',
            padding: 'tight',
            status: 'disabled',
        });
    });

    it('shows MT5TradeModal when list is clicked and status is active', async () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />, { wrapper });

        await userEvent.click(screen.getByTestId('dt_wallets_trading_account_card'));

        await waitFor(() => {
            expect(screen.getByText('MT5TradeModal')).toBeInTheDocument();
            expect(mockPropsFn).toBeCalledWith({
                marketType: mockAccount.market_type,
                mt5Account: mockAccount,
                platform: PlatformDetails.mt5.platform,
            });
        });
    });

    it('shows TradingPlatformStatusModal when platform is under maintenance', async () => {
        (useAddedMT5Account as jest.Mock).mockReturnValue({
            ...mockUseAddedMT5AccountData,
            hasDisabledPlatformStatus: true,
            platformStatus: MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE,
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />, { wrapper });

        await userEvent.click(screen.getByTestId('dt_wallets_trading_account_card'));

        await waitFor(() => {
            expect(screen.getByText('TradingPlatformStatusModal')).toBeInTheDocument();
            expect(mockPropsFn).toBeCalledWith({
                status: 'under_maintenance',
            });
        });
    });

    it('shows the WalletDisabledAccountModal when a disabled account MT5 account is clicked', async () => {
        (useAddedMT5Account as jest.Mock).mockReturnValue({
            ...mockUseAddedMT5AccountData,
            hasDisabledPlatformStatus: true,
            isAccountDisabled: true,
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />, { wrapper });

        await waitFor(async () => {
            await userEvent.click(screen.getByText('WalletStatusBadge'));
        });

        await waitFor(() => {
            expect(screen.getByText('WalletDisabledAccountModal')).toBeInTheDocument();
        });
    });
});
