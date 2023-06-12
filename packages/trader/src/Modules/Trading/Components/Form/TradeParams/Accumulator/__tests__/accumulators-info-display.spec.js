import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorsInfoDisplay from '../accumulators-info-display';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../../../trader-providers';

const mock_connect_props = {
    modules: {
        trade: {
            currency: 'USD',
            maximum_payout: 10000,
            maximum_ticks: 250,
        },
    },
};

describe('AccumulatorsInfoDisplay', () => {
    it('should render correct Maximum payout and Maximum ticks', () => {
        render(<AccumulatorsInfoDisplay />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getByRole('group')).toHaveClass('trade-container__fieldset accu-info-display');
        expect(screen.getByText(/max. payout/i)).toBeInTheDocument();
        expect(screen.getByText('10,000.00 USD')).toBeInTheDocument();
        expect(screen.getByText(/max. ticks/i)).toBeInTheDocument();
        expect(screen.getByText('250 ticks')).toBeInTheDocument();
    });
});
