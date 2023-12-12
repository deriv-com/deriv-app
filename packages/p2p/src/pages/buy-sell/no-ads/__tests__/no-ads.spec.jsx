import React from 'react';
import { render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import NoAds from '../no-ads';

const mock_store_values = {
    buy_sell_store: {
        is_buy: true,
        local_currencies: [
            {
                text: 'USD',
                value: 'USD',
                is_default: true,
            },
        ],
        selected_local_currency: 'USD',
        setCreateSellAdFromNoAds: jest.fn(),
    },
    general_store: {
        handleTabClick: jest.fn(),
        is_barred: false,
    },
    my_ads_store: {
        setShowAdForm: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store_values),
}));

const mock_props = {
    is_ads_page: false,
};

describe('<NoAds/>', () => {
    it('should render the component', () => {
        render(<NoAds />);
        expect(screen.getByText('No ads for this currency 😞')).toBeInTheDocument();
        expect(screen.getByText('Create ad')).toBeInTheDocument();
        expect(
            screen.getByText('Looking to buy or sell USD? You can post your own ad for others to respond.')
        ).toBeInTheDocument();
    });
    it('should display "You have no ads 😞" when is_ads_page is true', () => {
        render(<NoAds {...mock_props} is_ads_page />);
        expect(screen.getByText('You have no ads 😞')).toBeInTheDocument();
        expect(screen.getByText('Create new ad')).toBeInTheDocument();
    });
    it('should handle onclick of create ad button', () => {
        const history = createBrowserHistory();
        render(
            <Router history={history}>
                <NoAds is_ads_page />
            </Router>
        );
        const create_ad_button = screen.getByRole('button', { name: 'Create new ad' });
        expect(create_ad_button).toBeInTheDocument();
        create_ad_button.click();
        expect(mock_store_values.general_store.handleTabClick).toHaveBeenCalledTimes(0);
        expect(mock_store_values.my_ads_store.setShowAdForm).toHaveBeenCalledWith(true);
    });
});
