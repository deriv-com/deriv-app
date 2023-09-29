import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { isMobile } from '@deriv/shared';
import TraderProviders from '../../../../../../../trader-providers';
import AccumulatorsInfoDisplay from '../accumulators-info-display';

const mock_connect_props = {
    modules: {
        trade: {
            currency: 'USD',
            maximum_payout: 10000,
            maximum_ticks: 250,
        },
    },
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Popover: jest.fn(({ children, ...props }) => (
        <div className={props.classNameBubble} data-testid={props.alignment}>
            {children}
        </div>
    )),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

describe('AccumulatorsInfoDisplay', () => {
    it('should render popover components as children with proper classname and values', () => {
        render(<AccumulatorsInfoDisplay />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });

        expect(screen.getByText(/Max. payout/i)).toBeInTheDocument();
        expect(screen.getByText(/10,000.00 USD/i)).toBeInTheDocument();
        expect(screen.getByText(/Max. ticks/i)).toBeInTheDocument();
        expect(screen.getByText(/250 ticks/i)).toBeInTheDocument();
    });

    it('should render correct phrase if maximum_ticks === 1', () => {
        const new_mock_connect_props = { ...mock_connect_props };
        new_mock_connect_props.modules.trade.maximum_ticks = 1;
        render(<AccumulatorsInfoDisplay />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(new_mock_connect_props)}>{children}</TraderProviders>
            ),
        });

        expect(screen.getByRole('group')).toHaveClass('trade-container__fieldset accu-info-display');
        expect(screen.getByText(/1 tick/i)).toBeInTheDocument();
    });

    it('should render correct max ticks if they were not passed', () => {
        const new_mock_connect_props = {
            modules: {
                trade: {
                    currency: 'USD',
                    maximum_payout: 10000,
                },
            },
        };
        render(<AccumulatorsInfoDisplay />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(new_mock_connect_props)}>{children}</TraderProviders>
            ),
        });

        expect(screen.getByText(/max. payout/i)).toBeInTheDocument();
        expect(screen.getByText(/0 ticks/i)).toBeInTheDocument();
    });

    it('should pass correct aligment for mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        render(<AccumulatorsInfoDisplay />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });

        expect(screen.getAllByTestId(/top/i)).toHaveLength(2);
    });
});
