import React from 'react';
import { render, screen } from '@testing-library/react';
import MultiplierTradeDescription from '../multiplier-trade-description';

const default_mock_props = {
    is_multiplier_fx: false,
    onClick: jest.fn(),
};
const stop_loss = 'Stop loss';
const deal_cancellation = 'Deal cancellation';

describe('<MultiplierTradeDescription />', () => {
    it('should render a proper text if is_multiplier_fx is falsy', () => {
        render(<MultiplierTradeDescription {...default_mock_props} />);

        expect(screen.getByText(stop_loss)).toBeInTheDocument();
        expect(screen.getByText(deal_cancellation)).toBeInTheDocument();
    });
    it('should render a proper text if is_multiplier_fx is true', () => {
        render(<MultiplierTradeDescription {...default_mock_props} is_multiplier_fx />);

        expect(screen.getByText(stop_loss)).toBeInTheDocument();
        expect(screen.queryByText(deal_cancellation)).not.toBeInTheDocument();
    });
});
