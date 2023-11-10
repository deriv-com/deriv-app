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
        currency: 'USD',
        profit_value: 0.35,
        should_show_profit_percentage: false,
    };
    it('should render AccumulatorsProfitLossText', () => {
        render(<AccumulatorsProfitLossText {...props} />);
        const whole_number = screen.getByText(/\+0./i);
        expect(whole_number).toBeInTheDocument();
        expect(screen.getByText('3')).toHaveClass('profit-loss-text__sliding-tenth');
        expect(screen.getByText('USD')).toHaveClass('profit-loss-text__currency');
    });
    it('should render AccumulatorsProfitLossText with a value of >= 1K correctly', () => {
        render(<AccumulatorsProfitLossText {...props} profit_value={1040} />);
        const whole_number = screen.getByText(/\+1,040./i);
        expect(whole_number).toBeInTheDocument();
    });
    it('should render AccumulatorsProfitLossText with a profit percentage value', () => {
        render(<AccumulatorsProfitLossText {...props} profit_value={3.14} should_show_profit_percentage />);
        expect(screen.getByText(/\+3./i)).toBeInTheDocument();
        expect(screen.getByText('1')).toHaveClass('profit-loss-text__sliding-tenth');
        expect(screen.getByText('%')).toBeInTheDocument();
        expect(screen.queryByText('USD')).not.toBeInTheDocument();
    });
    it('should render AccumulatorsProfitLossText with a profit percentage value of >= 1K', () => {
        render(<AccumulatorsProfitLossText {...props} profit_value={1040} should_show_profit_percentage />);
        expect(screen.getByText(/\+1,040./i)).toBeInTheDocument();
        expect(screen.getByText('0')).toHaveClass('profit-loss-text__sliding-tenth');
        expect(screen.getByText('%')).toBeInTheDocument();
        expect(screen.queryByText('USD')).not.toBeInTheDocument();
    });
    it('should render AccumulatorsProfitLossText with a negative profit percentage value', () => {
        render(<AccumulatorsProfitLossText {...props} profit_value={-100} should_show_profit_percentage />);
        expect(screen.getByText(/-100./i)).toBeInTheDocument();
        expect(screen.getByText('0')).toHaveClass('profit-loss-text__sliding-tenth');
        expect(screen.getByText('%')).toBeInTheDocument();
        expect(screen.queryByText('USD')).not.toBeInTheDocument();
    });
});
