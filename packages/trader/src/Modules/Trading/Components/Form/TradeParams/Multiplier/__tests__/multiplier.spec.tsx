import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import Multiplier from '../multiplier';
import TraderProviders from '../../../../../../../trader-providers';

const mocked_props = {
    modules: {
        trade: {
            multiplier: 10,
            multiplier_range_list: [],
            onChange: jest.fn(),
            symbol: '1HZ100V',
        },
    },
};
describe('<Multiplier/>', () => {
    const mockMultiplier = () => {
        return (
            <TraderProviders store={mockStore(mocked_props)}>
                <Multiplier />
            </TraderProviders>
        );
    };

    it('should render component', () => {
        render(mockMultiplier());

        expect(screen.getByTestId('multiplier')).toBeInTheDocument();
    });
});
