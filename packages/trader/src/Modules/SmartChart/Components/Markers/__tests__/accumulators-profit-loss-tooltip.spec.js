import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorsProfitLossTooltip from '../accumulators-profit-loss-tooltip.jsx';

jest.mock('Modules/SmartChart', () => ({
    ...jest.requireActual('Modules/SmartChart'),
    FastMarker: jest.fn(({ children, className }) => <div className={className}>{children}</div>),
}));
jest.mock('../accumulators-profit-loss-text', () => () => 'AccumulatorsProfitLossText');

describe('AccumulatorsProfitLossTooltip', () => {
    const props = {
        className: 'profit-loss-tooltip',
        currency: 'USD',
        current_spot: 6468.95,
        current_spot_time: 1666091856,
        high_barrier: '6469.10',
        is_sold: 0,
        profit: +0.15,
        alignment: 'right',
    };
    const profit_text = 'Total profit/loss:';

    it('should render AccumulatorsProfitLossText if contract is not sold', () => {
        render(<AccumulatorsProfitLossTooltip {...props} />);

        expect(screen.getByText('AccumulatorsProfitLossText')).toBeInTheDocument();
    });

    it('should render AccumulatorsProfitLossTooltip when contract is sold', () => {
        jest.useFakeTimers();

        render(
            <AccumulatorsProfitLossTooltip
                {...props}
                is_sold={1}
                exit_tick={props.current_spot}
                exit_tick_time={props.current_spot_time}
            />
        );

        const spot_el = screen.getByTestId('dt_accumulator_tooltip_spot');
        expect(spot_el).toBeInTheDocument();
        expect(spot_el).toHaveClass('profit-loss-tooltip__spot-circle');
        expect(spot_el.closest('div')).toHaveClass('profit-loss-tooltip');
        expect(screen.getByText(profit_text)).toBeInTheDocument();
        expect(screen.getByText(profit_text).closest('div')).not.toHaveClass('profit-loss-tooltip__content-exit');
        expect(screen.getByText(profit_text).closest('div')).toHaveClass('profit-loss-tooltip__content-enter-active');
    });
});
