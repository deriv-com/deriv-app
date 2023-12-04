import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorsSellButton from '../accumulators-sell-button';
import { mockStore } from '@deriv/stores';
import { mockContractInfo } from '@deriv/shared';
import TraderProviders from '../../../../../../../trader-providers';

const mock_default_props = {
    is_disabled: false,
    onClick: jest.fn(),
    contract_info: mockContractInfo({
        is_valid_to_sell: 1,
        status: 'open',
    }),
    current_stake: 10,
    currency: 'USD',
};

describe('AccumulatorsSellButton', () => {
    const mockAccumulatorsSellButton = (mocked_props: React.ComponentProps<typeof AccumulatorsSellButton>) => {
        return (
            <TraderProviders store={mockStore({})}>
                <AccumulatorsSellButton {...mocked_props} />
            </TraderProviders>
        );
    };

    it('should render component', () => {
        render(mockAccumulatorsSellButton(mock_default_props));

        expect(screen.getByRole('button')).toBeEnabled();
        expect(screen.getByText(/Sell/i)).toBeInTheDocument();
        expect(screen.getByText(/10.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Note:/i)).toBeInTheDocument();
    });
    it('should render component with disabled button and without current stake', () => {
        const new_mock_props = { ...mock_default_props, is_disabled: true, current_stake: null };
        render(mockAccumulatorsSellButton(new_mock_props));

        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByText(/Sell/i)).toBeInTheDocument();
        expect(screen.queryByText(/10.00/i)).not.toBeInTheDocument();
    });
});
