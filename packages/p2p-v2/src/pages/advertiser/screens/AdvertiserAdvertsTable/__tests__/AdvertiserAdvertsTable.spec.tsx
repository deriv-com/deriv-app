import React from 'react';
import { APIProvider, AuthProvider, p2p } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdvertiserAdvertsTable from '../AdvertiserAdvertsTable';

let mockApiValues = {
    isFetching: false,
    isLoading: true,
    loadMoreAdverts: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        advert: {
            useGetList: jest.fn(() => mockApiValues),
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
    },
}));

const mockUseGetList = p2p.advert.useGetList as jest.Mock;

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

describe('<AdvertiserAdvertsTable />', () => {
    it('should show the Loader component if isLoading is true', () => {
        render(<AdvertiserAdvertsTable advertiserId='123' />, { wrapper });

        expect(screen.getByRole('button', { name: 'Buy' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sell' })).toBeInTheDocument();
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should show There are no adverts yet message if data is empty', () => {
        mockApiValues = {
            ...mockApiValues,
            isLoading: false,
        };
        mockUseGetList.mockReturnValue(mockApiValues);

        render(<AdvertiserAdvertsTable advertiserId='123' />, { wrapper });

        expect(screen.getByText('There are no ads yet')).toBeInTheDocument();
    });

    it('should show the AdvertsTableRenderer component if data is not empty', () => {
        mockApiValues = {
            ...mockApiValues,
            data: [
                {
                    account_currency: 'USD',
                    advertiser_id: '123',
                    counterparty_type: 'buy',
                    id: '123',
                    max_order_amount_limit_display: '100.00',
                    min_order_amount_limit_display: '10.00',
                    payment_method_names: ['Bank Transfer', 'Other'],
                },
            ],
            isLoading: false,
        };
        mockUseGetList.mockReturnValue(mockApiValues);

        render(<AdvertiserAdvertsTable advertiserId='123' />, { wrapper });

        expect(screen.getByText('Limits')).toBeInTheDocument();
        expect(screen.getByText(/10.00-100.00 USD/)).toBeInTheDocument();

        expect(screen.getByText('Rate (1 USD)')).toBeInTheDocument();
        expect(screen.getByText('0.00')).toBeInTheDocument();

        expect(screen.getByText('Payment methods')).toBeInTheDocument();
        expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
        expect(screen.getByText('Other')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Buy USD' })).toBeInTheDocument();
    });

    it('should show Sell Tab is active when tab is clicked on', () => {
        mockApiValues = {
            ...mockApiValues,
            data: [
                {
                    account_currency: 'USD',
                    advertiser_id: '123',
                    counterparty_type: 'sell',
                    id: '123',
                    max_order_amount_limit_display: '100.00',
                    min_order_amount_limit_display: '10.00',
                    payment_method_names: ['Bank Transfer', 'Other'],
                },
            ],
            isLoading: false,
        };
        mockUseGetList.mockReturnValue(mockApiValues);

        render(<AdvertiserAdvertsTable advertiserId='123' />, { wrapper });

        userEvent.click(screen.getByRole('button', { name: 'Sell' }));

        const activeClass = 'derivs-secondary-tabs__btn derivs-secondary-tabs__btn--active';

        expect(screen.getByRole('button', { name: 'Buy' })).not.toHaveClass(activeClass);
        expect(screen.getByRole('button', { name: 'Sell' })).toHaveClass(activeClass);

        expect(screen.getByRole('button', { name: 'Sell USD' })).toBeInTheDocument();
    });
});
