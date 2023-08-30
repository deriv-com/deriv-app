import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import Header from '../header';

const mock_use_location = {
    pathname: '',
};
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => mock_use_location,
}));
jest.mock('../default-header.jsx', () => jest.fn(() => 'MockedDefaultHeader'));
jest.mock('../dtrader-header.jsx', () => jest.fn(() => 'MockedDTraderHeader'));
jest.mock('../traders-hub-header', () => jest.fn(() => 'MockedTradersHubHeader'));

describe('Header', () => {
    const store = mockStore({
        client: { is_logged_in: true },
    });
    const renderComponent = (modified_store = store) =>
        render(
            <StoreProvider store={modified_store}>
                <Header />
            </StoreProvider>
        );

    it('should render the "TradersHubHeader" component if user is logged in and in traders hub route', () => {
        mock_use_location.pathname = '/appstore/traders-hub';
        renderComponent();
        expect(screen.getByText('MockedTradersHubHeader')).toBeInTheDocument();
    });

    it('should render the "DTraderHeader" component if user is logged in and not in the traders hub route', () => {
        mock_use_location.pathname = '/';
        renderComponent();
        expect(screen.getByText('MockedDTraderHeader')).toBeInTheDocument();
    });

    it('should render the "DefaultHeader" component if user is not logged in', () => {
        renderComponent(mockStore({ client: { is_logged_in: false } }));
        expect(screen.getByText('MockedDefaultHeader')).toBeInTheDocument();
    });
});
