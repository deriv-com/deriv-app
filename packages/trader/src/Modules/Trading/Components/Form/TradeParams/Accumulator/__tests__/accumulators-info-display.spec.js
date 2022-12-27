import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorsInfoDisplay from '../accumulators-info-display';

const mock_connect_props = {
    currency: 'USD',
    maximum_payout: 10000,
    maximum_ticks: 250,
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => props => Component({ ...props, ...mock_connect_props }),
}));

describe('AccumulatorsInfoDisplay', () => {
    it('should render correct Maximum payout and Maximum ticks', () => {
        render(<AccumulatorsInfoDisplay />);
        expect(screen.getByRole('group')).toHaveClass('trade-container__fieldset accu-info-display');
        expect(screen.getByText(/maximum payout/i)).toBeInTheDocument();
        expect(screen.getByText('10,000.00 USD')).toBeInTheDocument();
        expect(screen.getByText(/maximum ticks/i)).toBeInTheDocument();
        expect(screen.getByText('250 ticks')).toBeInTheDocument();
    });
});
