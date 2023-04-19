import React from 'react';
import RealAccountSwitcher from '../real-account-switcher';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('Components/containers/currency-switcher-container', () => ({
    __esModule: true,
    default: ({ children }: { children: JSX.Element }) => <div>{children}</div>,
}));

jest.mock('../real-account-card', () => ({
    __esModule: true,
    default: () => <div>RealAccountCard</div>,
}));

jest.mock('@deriv/account', () => ({
    __esModule: true,
    getStatusBadgeConfig: () => ({
        text: 'Pending verification',
        icon: 'pending',
    }),
}));

describe('RealAccountSwitcher', () => {
    it('should render the component', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealAccountSwitcher />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render AccountNeedsVerification component with the correct pending status', () => {
        const mock = mockStore({
            traders_hub: {
                multipliers_account_status: 'pending',
                is_eu_user: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealAccountSwitcher />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Pending verification')).toBeInTheDocument();
        expect(screen.getByText('Pending verification')).toHaveClass(
            'switcher-status-badge__container switcher-status-badge__container--pending'
        );
    });

    it('should render RealAccountCard if its an eu user and has a maltainvest account', () => {
        const mock = mockStore({
            client: {
                has_maltainvest_account: true,
            },
            traders_hub: {
                is_eu_user: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealAccountSwitcher />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('RealAccountCard')).toBeInTheDocument();
    });

    it('should render RealAccountCard if the user has no cr account and not an eu user', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealAccountSwitcher />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('RealAccountCard')).toBeInTheDocument();
    });
});
