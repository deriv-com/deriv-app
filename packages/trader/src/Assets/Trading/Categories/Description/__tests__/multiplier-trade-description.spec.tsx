import React from 'react';
import { render, screen } from '@testing-library/react';
import MultiplierTradeDescription from '../multiplier-trade-description';

const default_mock_props = {
    is_multiplier_fx: false,
    onClick: jest.fn(),
};
describe('<MultiplierTradeDescription />', () => {
    it('should render a proper text if is_multiplier_fx is falsy', () => {
        render(<MultiplierTradeDescription {...default_mock_props} />);

        expect(screen.getByText(/Stop loss/i)).toBeInTheDocument();
        expect(screen.getByText(/Deal cancellation/i)).toBeInTheDocument();
    });
    it('should render a proper text if is_multiplier_fx is true', () => {
        render(<MultiplierTradeDescription {...default_mock_props} is_multiplier_fx />);

        expect(screen.getByText(/Stop loss/i)).toBeInTheDocument();
        expect(screen.queryByText(/Deal cancellation/i)).not.toBeInTheDocument();
    });
});
