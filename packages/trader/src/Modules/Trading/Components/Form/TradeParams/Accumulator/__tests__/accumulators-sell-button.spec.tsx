import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorsSellButton from '../accumulators-sell-button';

const mock_default_props = {
    is_disabled: false,
    onClick: jest.fn(),
    current_stake: 10,
    currency: 'USD',
};

describe('AccumulatorsSellButton', () => {
    it('should render component', () => {
        render(<AccumulatorsSellButton {...mock_default_props} />);

        expect(screen.getByRole('button')).toBeEnabled();
        expect(screen.getByText(/Sell/i)).toBeInTheDocument();
        expect(screen.getByText(/10.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Note:/i)).toBeInTheDocument();
    });
    it('should render component with disabled button and without current stake', () => {
        const new_mock_props = { ...mock_default_props, is_disabled: true, current_stake: null };
        render(<AccumulatorsSellButton {...new_mock_props} />);

        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByText(/Sell/i)).toBeInTheDocument();
        expect(screen.queryByText(/10.00/i)).not.toBeInTheDocument();
    });
});
