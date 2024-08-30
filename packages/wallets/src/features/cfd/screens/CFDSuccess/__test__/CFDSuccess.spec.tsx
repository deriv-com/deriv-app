import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen, within } from '@testing-library/react';
import useDevice from '../../../../../hooks/useDevice';
import CFDSuccess from '../CFDSuccess';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(() => ({
        data: { currency: 'USD', is_virtual: false },
    })),
}));

jest.mock('../../../../../hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isDesktop: true,
    })),
}));

jest.mock('../../../../../components/WalletGradientBackground', () => ({
    WalletGradientBackground: ({ children }: { children: JSX.Element }) => (
        <div data-testid='dt_wallet_gradient_background'>{children}</div>
    ),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    WalletSuccess: ({
        description,
        renderIcon,
        title,
    }: {
        description: string;
        renderIcon: () => React.ReactNode;
        title: string;
    }) => (
        <div data-testid='dt_wallet_success'>
            {renderIcon()}
            <div>{title}</div>
            <div>{description}</div>
        </div>
    ),
}));

describe('CFDSuccess', () => {
    const mockProps = {
        description: 'Test description',
        displayBalance: '1000 USD',
        marketType: 'financial' as const,
        platform: 'mt5' as const,
        title: 'Test Title',
    };

    it('renders default CFD success content', () => {
        render(<CFDSuccess {...mockProps} />);

        expect(screen.getByTestId('dt_wallet_success')).toBeInTheDocument();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByText('MT5 Financial')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('1000 USD')).toBeInTheDocument();
    });

    it('renders demo badge for virtual account', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { currency: 'USD', is_virtual: true },
        });

        render(<CFDSuccess {...mockProps} />);

        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('renders real badge for non-virtual account', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { currency: 'USD', is_virtual: false },
        });

        render(<CFDSuccess {...mockProps} />);

        expect(screen.getByText('Real')).toBeInTheDocument();
    });

    it('renders skeleton loader when display balance is not provided', () => {
        render(<CFDSuccess {...mockProps} displayBalance='' />);

        expect(screen.getByTestId('dt_wallet_success')).toBeInTheDocument();
        expect(screen.queryByText('1000 USD')).not.toBeInTheDocument();
        const gradientBackground = screen.getAllByTestId('dt_wallet_gradient_background')[0];
        expect(within(gradientBackground).getByTestId('dt_wallets_cfd_success_skeleton_loader')).toBeInTheDocument();
    });

    it('renders correct market type for Deriv X', () => {
        render(<CFDSuccess {...mockProps} marketType='all' platform='dxtrade' />);

        expect(screen.getByText('Deriv X')).toBeInTheDocument();
    });

    it('renders correct market type for Deriv cTrader', () => {
        render(<CFDSuccess {...mockProps} marketType='all' platform='ctrader' />);

        expect(screen.getByText('Deriv cTrader')).toBeInTheDocument();
    });

    it('does not render buttons on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        const mockRenderButton = jest.fn<JSX.Element, []>(() => <button>Mock Action Button</button>);

        render(<CFDSuccess {...mockProps} actionButtons={mockRenderButton} />);

        expect(mockRenderButton).not.toHaveBeenCalled();
        expect(screen.queryByText('Mock Action Button')).not.toBeInTheDocument();
    });

    it('renders correct content when active wallet is undefined', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: undefined,
        });
        render(<CFDSuccess {...mockProps} />);

        expect(screen.getByTestId('dt_wallet_success')).toBeInTheDocument();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByText('MT5 Financial')).toBeInTheDocument();
        expect(screen.getByText('1000 USD')).toBeInTheDocument();
        expect(screen.queryByText('USD Wallet')).not.toBeInTheDocument();
    });
});
