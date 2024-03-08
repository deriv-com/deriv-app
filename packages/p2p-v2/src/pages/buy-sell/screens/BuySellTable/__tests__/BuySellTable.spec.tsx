import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import BuySellTable from '../BuySellTable';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

let mockAdvertiserListData = {
    data: [],
    isFetching: false,
    isLoading: true,
    loadMoreAdverts: jest.fn(),
};

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        advert: {
            useGetList: jest.fn(() => mockAdvertiserListData),
        },
        advertiser: {
            useGetInfo: jest.fn(() => ({ data: { id: '123' } })),
        },
        advertiserPaymentMethods: {
            useGet: jest.fn(() => ({ data: [] })),
        },
        paymentMethods: {
            useGet: jest.fn(() => ({ data: [] })),
        },
        settings: {
            useGetSettings: jest.fn(() => ({
                data: {},
            })),
        },
    },
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('../../BuySellHeader/BuySellHeader', () => jest.fn(() => <div>BuySellHeader</div>));

describe('<BuySellTable.spec />', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://app.deriv.com/cashier/p2p-v2/buy-sell',
            },
            writable: true,
        });
    });
    it('should render the BuySellHeader component and loader component if isLoading is true', () => {
        render(<BuySellTable />, { wrapper });

        expect(screen.getByText('BuySellHeader')).toBeInTheDocument();
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should render the Table component if data is not empty', async () => {
        mockAdvertiserListData = {
            data: [
                // @ts-expect-error caused by typing of never[]
                {
                    account_currency: 'USD',
                    advertiser_details: {
                        completed_orders_count: 300,
                        id: '1',
                        is_online: true,
                        name: 'John Doe',
                        rating_average: 5,
                        rating_count: 1,
                    },
                    counterparty_type: 'buy',
                    effective_rate: 0.0001,
                    local_currency: 'USD',
                    max_order_amount_limit_display: 100,
                    min_order_amount_limit_display: 10,
                    payment_method_names: ['Bank transfer'],
                    price_display: 100,
                    rate: 0.0001,
                    rate_type: 'fixed',
                },
            ],
            isFetching: false,
            isLoading: false,
            loadMoreAdverts: jest.fn(),
        };

        render(<BuySellTable />, { wrapper });

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('250+')).toBeInTheDocument();
            expect(screen.getByText('10-100 USD')).toBeInTheDocument();
            expect(screen.getByText('100.00 USD')).toBeInTheDocument();
            expect(screen.getByText('Bank transfer')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Buy USD' })).toBeInTheDocument();
        });
    });
});
