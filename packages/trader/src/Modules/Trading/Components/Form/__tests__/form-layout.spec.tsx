import React from 'react';
import { render, screen } from '@testing-library/react';
import FormLayout from '../form-layout';
import Loadable from 'react-loadable';

Loadable.preloadAll();

const mock_props = {
    is_market_closed: false,
    is_trade_enabled: false,
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));
jest.mock('../screen-large', () => jest.fn(() => 'ScreenLarge'));

describe('FormLayout', () => {
    it('should render the componet', () => {
        render(<FormLayout {...mock_props} />);

        expect(screen.queryByText('ScreenLarge')).toBeInTheDocument();
    });
});
