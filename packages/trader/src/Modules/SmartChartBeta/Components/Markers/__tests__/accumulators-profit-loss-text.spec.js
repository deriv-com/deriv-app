import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorsProfitLossTextBeta from '../accumulators-profit-loss-text';

jest.mock('Modules/SmartChartBeta', () => ({
    ...jest.requireActual('Modules/SmartChartBeta'),
    FastMarkerBeta: jest.fn(({ children, className }) => <div className={className}>{children}</div>),
}));

describe('AccumulatorsProfitLossText', () => {
    const props = {
        className: 'profit-loss-text',
        currency: 'USD',
        profit: +0.35,
    };

    it('should render AccumulatorsProfitLossText', () => {
        render(<AccumulatorsProfitLossTextBeta {...props} />);
        const text_el = screen.getByTestId('dt_accumulator_profit_text');
        expect(text_el).toHaveClass('profit-loss-text__profit');
        expect(screen.getByText('3')).toHaveClass('profit-loss-text__sliding-tenth');
        expect(screen.getByText('USD')).toHaveClass('profit-loss-text__currency');
    });
});
