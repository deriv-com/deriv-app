import React from 'react';
import { render, screen } from '@testing-library/react';
import FormLayout from '../form-layout';
import Loadable from 'react-loadable';
import TraderProviders from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';

Loadable.preloadAll();

const mock_props = {
    is_market_closed: false,
    is_trade_enabled: false,
};

const mock_store = {
    common: {
        current_language: 'en',
    },
};

const store = mockStore(mock_store);

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));
jest.mock('../screen-large', () => jest.fn(() => 'ScreenLarge'));

describe('FormLayout', () => {
    const mockedFormLayout = (mock_props: { is_market_closed: boolean; is_trade_enabled: boolean }) => {
        return (
            <TraderProviders store={store}>
                <FormLayout {...mock_props} />
            </TraderProviders>
        );
    };
    it('should render the component', () => {
        render(mockedFormLayout(mock_props));
        expect(screen.queryByText('ScreenLarge')).toBeInTheDocument();
    });
});
