import React from 'react';
import { render, screen } from '@testing-library/react';
import AdSummary from '../AdSummary';

const mockProps = {
    currency: 'USD',
    localCurrency: 'IDR',
    offerAmount: '',
    priceRate: 0,
    rateType: 'fixed',
    type: 'buy',
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useQueryString: jest.fn().mockReturnValue({
        queryString: {
            formAction: 'create',
        },
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        settings: {
            useGetSettings: () => ({
                data: {
                    order_payment_period: 60,
                    override_exchange_rate: 0.01,
                },
            }),
        },
    },
    useExchangeRateSubscription: () => ({
        data: {
            rates: {
                IDR: 14000,
            },
        },
        subscribe: jest.fn(),
    }),
}));

describe('<AdSummary />', () => {
    it('should render the default ad summary line with buy ad for create', () => {
        render(<AdSummary {...mockProps} />);
        expect(screen.getByText('You’re creating an ad to buy...')).toBeInTheDocument();
    });
    it('should render the default ad summary line with sell ad for create', () => {
        render(<AdSummary {...mockProps} type='sell' />);
        expect(screen.getByText('You’re creating an ad to sell...')).toBeInTheDocument();
    });
    it('should render the ad summary line with offer amount for buy ad for create', () => {
        render(<AdSummary {...mockProps} offerAmount='100' />);
        expect(screen.getByText(/You’re creating an ad to buy/)).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
    });
    it('should render the ad summary line with offer amount and price rate for buy ad for create', () => {
        render(<AdSummary {...mockProps} offerAmount='100' priceRate={0.01} />);
        expect(screen.getByText(/You’re creating an ad to buy/)).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('(0.01 IDR/USD)')).toBeInTheDocument();
    });
    it('should render the ad summary line with offer amount and price rate for sell ad for create', () => {
        render(<AdSummary {...mockProps} offerAmount='100' priceRate={2} type='sell' />);
        expect(screen.getByText(/You’re creating an ad to sell/)).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('(2.00 IDR/USD)')).toBeInTheDocument();
    });
});
