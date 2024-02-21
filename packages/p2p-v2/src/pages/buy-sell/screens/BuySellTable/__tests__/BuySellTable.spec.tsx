import React from 'react';
import { APIProvider } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import BuySellTable from '../BuySellTable';

const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

let mockAdvertiserListData = {
    data: [],
    isFetching: false,
    isLoading: true,
    loadMoreAdverts: jest.fn(),
};

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    p2p: {
        advert: {
            useGetList: jest.fn(() => mockAdvertiserListData),
        },
        advertiser: {
            useGetInfo: jest.fn(() => ({ data: { id: '123' } })),
        },
    },
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('<BuySellTable.spec />', () => {
    it('should render the BuySellHeader component and loader component if isLoading is true', () => {
        render(<BuySellTable />, { wrapper });

        expect(screen.getByTestId('dt_p2p_v2_buy_sell_header')).toBeInTheDocument();
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should render the Table component if data is not empty', () => {
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

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('250+')).toBeInTheDocument();
        expect(screen.getByText('10-100 USD')).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Bank transfer')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Buy USD' })).toBeInTheDocument();
    });
});
