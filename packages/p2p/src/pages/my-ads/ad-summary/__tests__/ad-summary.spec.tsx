import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useStores } from 'Stores';
import AdSummary from '../ad-summary';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    floating_rate_store: {
        rate_type: 'float',
        market_rate: 0.0001,
    },
    my_ads_store: {
        required_ad_type: 'fixed',
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

const mock_use_store_values = mockStore({
    client: {
        currency: 'USD',
        local_currency_config: {
            currency: 'USD',
        },
    },
});

const mock_props = {
    offer_amount: '',
    price_rate: '',
    type: 'buy',
    ad_option: 'create',
};

describe('<AdSummary/>', () => {
    it('should render the default ad summary line with buy ad for create', () => {
        render(
            <StoreProvider store={mock_use_store_values}>
                <AdSummary {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText("You're creating an ad to buy...")).toBeInTheDocument();
    });
    it('should render the default ad summary line with sell ad for create', () => {
        const new_mock_props = { ...mock_props, type: 'sell' };
        render(
            <StoreProvider store={mock_use_store_values}>
                <AdSummary {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText("You're creating an ad to sell...")).toBeInTheDocument();
    });
    it('should render the ad summary line with offer amount for buy ad for create', () => {
        const new_mock_props = { ...mock_props, offer_amount: '100' };
        render(
            <StoreProvider store={mock_use_store_values}>
                <AdSummary {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText(/You're creating an ad to buy/)).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
    });
    it('should render the ad summary line with offer amount for sell ad for create', () => {
        const new_mock_props = { ...mock_props, offer_amount: '100', type: 'sell' };
        render(
            <StoreProvider store={mock_use_store_values}>
                <AdSummary {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText(/You're creating an ad to sell/)).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
    });
    it('should render the ad summary line with offer amount and price rate for buy ad for create', () => {
        const new_mock_props = { ...mock_props, offer_amount: '100', price_rate: '2' };
        render(
            <StoreProvider store={mock_use_store_values}>
                <AdSummary {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText(/You're creating an ad to buy/)).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('0.01 USD')).toBeInTheDocument();
    });
    it('should render the ad summary line with offer amount and price rate for sell ad for create', () => {
        const new_mock_props = { ...mock_props, offer_amount: '100', price_rate: '2', type: 'sell' };
        render(
            <StoreProvider store={mock_use_store_values}>
                <AdSummary {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText(/You're creating an ad to sell/)).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('0.01 USD')).toBeInTheDocument();
    });
    it('should render the ad summary line with offer amount and price rate for buy ad with fixed rate for create', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            floating_rate_store: {
                ...mocked_store_values.floating_rate_store,
                rate_type: 'fixed',
            },
        });
        const new_mock_props = { ...mock_props, offer_amount: '100', price_rate: '2' };
        render(
            <StoreProvider store={mock_use_store_values}>
                <AdSummary {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText(/You're creating an ad to buy/)).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('200.00 USD')).toBeInTheDocument();
    });
    it('should render the ad summary line with offer amount and price rate for buy ad with fixed rate for edit', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            floating_rate_store: {
                ...mocked_store_values.floating_rate_store,
                rate_type: 'fixed',
            },
        });
        const new_mock_props = { ...mock_props, offer_amount: '100', price_rate: '2', ad_option: 'edit' };
        render(
            <StoreProvider store={mock_use_store_values}>
                <AdSummary {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText(/You're editing an ad to buy/)).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('200.00 USD')).toBeInTheDocument();
    });
});
