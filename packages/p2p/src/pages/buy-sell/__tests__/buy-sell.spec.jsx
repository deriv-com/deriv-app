import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useStores } from 'Stores/index';
import BuySell from '../buy-sell';

const mock_store = {
    general_store: {
        should_show_popup: false,
        setShouldShowPopup: jest.fn(),
        setActiveIndex: jest.fn(),
        active_index: 1,
    },
    buy_sell_store: {
        registerIsListedReaction: jest.fn(() => jest.fn()),
        registerAdvertIntervalReaction: jest.fn(() => jest.fn()),
        selected_local_currency: 'USD',
        show_advertiser_page: false,
        should_show_verification: true,
        setLocalCurrency: jest.fn(),
    },
};

jest.mock('Components/verification/verification', () => jest.fn(() => <div>Verification Section</div>));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
        location: { state: '' },
        replace: jest.fn(),
    }),
}));

describe('<BuySellPage/>', () => {
    const renderComponent = () =>
        render(
            <StoreProvider store={mockStore({})}>
                <Router history={createBrowserHistory()}>
                    <BuySell />
                </Router>
            </StoreProvider>
        );
    it('should render the buy/sell page', () => {
        renderComponent();
        expect(mock_store.general_store.setActiveIndex).toHaveBeenCalledWith(0);
    });
    it('should render Verification Section when user is not verified', () => {
        renderComponent();

        expect(screen.getByText('Verification')).toBeInTheDocument();
        expect(screen.getByText('Verification Section')).toBeInTheDocument();
    });
    it('should not render the page return section when nickname form is open ', () => {
        useStores.mockReturnValue({
            ...mock_store,
            general_store: {
                ...mock_store.general_store,
                should_show_popup: true,
            },
        });
        renderComponent();

        expect(screen.queryByText('Verification')).not.toBeInTheDocument();
    });
});
