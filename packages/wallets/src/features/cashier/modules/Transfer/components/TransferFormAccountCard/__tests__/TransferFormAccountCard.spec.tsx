import React from 'react';
import { APIProvider } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../../../AuthProvider';
import TransferFormAccountCard from '../TransferFormAccountCard';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

describe('TransferFormAccountCard', () => {
    const mockAccount = {
        account_category: 'wallet',
        account_type: 'type1',
        accountName: 'Test Account',
        displayBalance: '1000 USD',
        mt5_group: 'group1',
    };

    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
        <APIProvider>
            <WalletsAuthProvider>{children}</WalletsAuthProvider>
        </APIProvider>
    );

    it('should render without crashing', () => {
        render(<TransferFormAccountCard account={undefined} hasPlatformStatus={jest.fn()} type={undefined} />, {
            wrapper,
        });

        expect(screen.queryByText('Test Account')).not.toBeInTheDocument();
        expect(screen.queryByText('Balance: 1000 USD')).not.toBeInTheDocument();
    });

    it('should render content for demo account card correctly', () => {
        const mockNewAccount = { ...mockAccount, currencyConfig: {}, demo_account: true };

        render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                hasPlatformStatus={jest.fn()}
                type='modal'
            />,
            { wrapper }
        );

        expect(screen.getByText('Test Account')).toBeInTheDocument();
        expect(screen.getByText('Balance: 1000 USD')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_wallet_market_icon')).not.toBeInTheDocument();
    });

    it('should render content for real account card correctly', () => {
        const mockNewAccount = { ...mockAccount, currencyConfig: { display_code: 'USD' }, demo_account: false };

        render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                hasPlatformStatus={jest.fn()}
                type='modal'
            />,
            { wrapper }
        );

        expect(screen.getByText('Test Account')).toBeInTheDocument();
        expect(screen.getByText('Balance: 1000 USD')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_wallet_market_icon')).not.toBeInTheDocument();
    });

    it('should render content for non-wallet account card correctly', () => {
        const mockNewAccount = {
            ...mockAccount,
            account_category: 'trading',
        };

        render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                hasPlatformStatus={jest.fn()}
                type='modal'
            />,
            { wrapper }
        );

        expect(screen.getByText('Test Account')).toBeInTheDocument();
        expect(screen.getByText('Balance: 1000 USD')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_market_icon')).toBeInTheDocument();
    });

    it('should display content for demo account in mobile input type correctly', () => {
        const mockNewAccount = { ...mockAccount, demo_account: true };
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                hasPlatformStatus={jest.fn()}
                type='input'
            />,
            { wrapper }
        );

        expect(screen.getByText('Test Account')).toBeInTheDocument();
        expect(screen.getByText('Balance: 1000 USD')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('should display content for real account in mobile input type correctly', () => {
        const mockNewAccount = { ...mockAccount, demo_account: false };
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                hasPlatformStatus={jest.fn()}
                type='input'
            />,
            { wrapper }
        );

        expect(screen.getByText('Test Account')).toBeInTheDocument();
        expect(screen.getByText('Balance: 1000 USD')).toBeInTheDocument();
    });

    it('should display different layouts for modal and input types', () => {
        const mockNewAccount = { ...mockAccount, demo_account: true };

        const { rerender } = render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                hasPlatformStatus={jest.fn()}
                type='modal'
            />,
            { wrapper }
        );

        expect(screen.getByText('Demo')).toBeInTheDocument();

        rerender(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                hasPlatformStatus={jest.fn()}
                type='input'
            />
        );

        expect(screen.queryByText('Demo')).not.toBeInTheDocument();
    });
});
