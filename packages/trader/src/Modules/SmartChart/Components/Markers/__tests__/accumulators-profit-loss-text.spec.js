import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorsProfitLossText from '../accumulators-profit-loss-text';

jest.mock('Modules/SmartChart', () => ({
    ...jest.requireActual('Modules/SmartChart'),
    FastMarker: jest.fn(({ children, className }) => <div className={className}>{children}</div>),
}));

describe('AccumulatorsProfitLossText', () => {
    const props = {
        className: 'profit-loss-text',
        currency: 'USD test',
        profit: +0.35,
    };

    it('should render AccumulatorsProfitLossText', () => {
        render(<AccumulatorsProfitLossText {...props} />);
        const text_el = screen.getByTestId('dt_accumulator_profit_text');
        expect(text_el).toHaveClass('profit-loss-text__profit');
        expect(screen.getByText('3')).toHaveClass('profit-loss-text__sliding-tenth');
        expect(screen.getByText('USD test')).toHaveClass('profit-loss-text__currency');
    });
});
