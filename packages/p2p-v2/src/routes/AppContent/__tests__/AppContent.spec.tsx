import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { APIProvider, AuthProvider, useActiveAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppContent from '../index';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockReturnValue({
        pathname: '/cashier/p2p-v2/buy-sell',
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        settings: {
            useGetSettings: jest.fn().mockReturnValue({
                data: {},
                subscribe: jest.fn(),
            }),
        },
    },
    useActiveAccount: jest.fn().mockReturnValue({
        data: { currency: 'EUR' },
        isLoading: true,
    }),
}));

jest.mock('@/pages/buy-sell', () => ({
    BuySell: () => <div>BuySell Page</div>,
}));

jest.mock('@/pages/orders', () => ({
    Orders: () => <div>Orders Page</div>,
}));

jest.mock('@/pages/my-ads', () => ({
    MyAds: () => <div>My Ads Page</div>,
}));

jest.mock('@/pages/my-profile', () => ({
    MyProfile: () => <div>My Profile Page</div>,
}));

jest.mock('@/pages/advertiser', () => ({
    Advertiser: () => <div>Advertiser Page</div>,
}));

jest.mock('@/pages/orders/screens/OrderDetails', () => ({
    OrderDetails: () => <div>OrderDetails</div>,
}));

jest.mock('@/pages/my-ads/screens/CreateEditAd', () => ({
    CreateEditAd: () => <div>CreateEditAd</div>,
}));

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

const mockUseActiveAccount = useActiveAccount as jest.Mock;

describe('<AppContent />', () => {
    it('should render the loading component', () => {
        render(<AppContent />, { wrapper });

        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should show P2P is only available for USD accounts', () => {
        mockUseActiveAccount.mockReturnValue({
            data: { currency: 'EUR' },
            isLoading: false,
        });

        render(<AppContent />, { wrapper });

        expect(screen.getByText('P2P is only available for USD accounts.')).toBeInTheDocument();
    });

    it('should render the BuySell component', async () => {
        mockUseActiveAccount.mockReturnValue({
            data: { currency: 'USD' },
            isLoading: false,
        });

        const history = createMemoryHistory();
        history.push('/cashier/p2p-v2/buy-sell');

        render(
            <Router history={history}>
                <AppContent />
            </Router>,
            { wrapper }
        );

        expect(screen.getByRole('button', { name: 'Buy/Sell' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Orders' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'My Ads' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'My Profile' })).toBeInTheDocument();

        expect(await screen.findByText('BuySell Page')).toBeInTheDocument();
    });

    it('should expect location to be orders when clicking on tab', async () => {
        const history = createMemoryHistory();
        history.push('/cashier/p2p-v2/buy-sell');

        render(
            <Router history={history}>
                <AppContent />
            </Router>,
            { wrapper }
        );

        const ordersTab = screen.getByRole('button', { name: 'Orders' });
        userEvent.click(ordersTab);

        expect(history.location.pathname).toEqual('/cashier/p2p-v2/orders');
    });

    it('should render the Orders component', async () => {
        const history = createMemoryHistory();
        history.push('/cashier/p2p-v2/orders');

        render(
            <Router history={history}>
                <AppContent />
            </Router>,
            { wrapper }
        );

        expect(await screen.findByText('Orders Page')).toBeInTheDocument();
    });

    it('should render the OrderDetails component', async () => {
        const history = createMemoryHistory();
        history.push('/cashier/p2p-v2/orders/8');

        render(
            <Router history={history}>
                <AppContent />
            </Router>,
            { wrapper }
        );

        expect(await screen.findByText('OrderDetails')).toBeInTheDocument();
    });

    it('should render the MyAds component', async () => {
        const history = createMemoryHistory();
        history.push('/cashier/p2p-v2/my-ads');

        render(
            <Router history={history}>
                <AppContent />
            </Router>,
            { wrapper }
        );

        expect(await screen.findByText('My Ads Page')).toBeInTheDocument();
    });

    it('should render the CreateEditAd component', async () => {
        const history = createMemoryHistory();
        history.push('/cashier/p2p-v2/my-ads/create');

        render(
            <Router history={history}>
                <AppContent />
            </Router>,
            { wrapper }
        );

        expect(await screen.findByText('CreateEditAd')).toBeInTheDocument();
    });

    it('should render the MyProfile component', async () => {
        const history = createMemoryHistory();
        history.push('/cashier/p2p-v2/my-profile');

        render(
            <Router history={history}>
                <AppContent />
            </Router>,
            { wrapper }
        );

        expect(await screen.findByText('My Profile Page')).toBeInTheDocument();
    });

    it('should render the Advertiser component', async () => {
        const history = createMemoryHistory();
        history.push('/cashier/p2p-v2/advertiser/1');

        render(
            <Router history={history}>
                <AppContent />
            </Router>,
            { wrapper }
        );

        expect(await screen.findByText('Advertiser Page')).toBeInTheDocument();
    });
});
