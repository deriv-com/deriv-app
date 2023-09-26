import React from 'react';
import { render, screen } from '@testing-library/react';
import Accumulator from '../accumulator';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../../../trader-providers';

const mock_connect_props = {
    modules: {
        trade: {
            accumulator_range_list: [0.01, 0.02, 0.03, 0.04, 0.05],
            onChange: jest.fn(),
            growth_rate: 0.01,
        },
    },
};

describe('Accumulator', () => {
    it('should render with the initially selected 1% growth_rate', () => {
        render(<Accumulator />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getByText('Growth rate')).toBeInTheDocument();
        expect(screen.getByText('1%')).toBeInTheDocument();
        expect(screen.getByText('2%')).toBeInTheDocument();
        expect(screen.getByText('3%')).toBeInTheDocument();
        expect(screen.getByText('4%')).toBeInTheDocument();
        expect(screen.getByText('5%')).toBeInTheDocument();
        expect(screen.getByText('1%')).toHaveClass('number-selector__selection--selected');
    });

    it('3% growth_rate should be selected when 0.03 is a currently selected and stored growth_rate value', () => {
        mock_connect_props.modules.trade.growth_rate = 0.03;
        render(<Accumulator />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getByText('3%')).toHaveClass('number-selector__selection--selected');
        expect(screen.getByText('1%')).not.toHaveClass('number-selector__selection--selected');
    });

    it('component should return null if accumulator_range_list is empty', () => {
        mock_connect_props.modules.trade.accumulator_range_list = [];
        const { container } = render(<Accumulator />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(container).toBeEmptyDOMElement();
    });

    it('should not render the component if accumulator_range_list is empty', () => {
        const new_mock_connect_props = { ...mock_connect_props };
        new_mock_connect_props.modules.trade = { accumulator_range_list: [], onChange: jest.fn(), growth_rate: 0.01 };
        render(<Accumulator />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(new_mock_connect_props)}>{children}</TraderProviders>
            ),
        });

        expect(screen.queryByText('Growth rate')).not.toBeInTheDocument();
        expect(screen.queryByText('1%')).not.toBeInTheDocument();
        expect(screen.queryByText('2%')).not.toBeInTheDocument();
    });
});
