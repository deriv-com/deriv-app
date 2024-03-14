import React from 'react';
import { act, render, screen } from '@testing-library/react';
import ArrowIndicator from '../arrow-indicator';
import Icon from '../../icon/icon';

jest.mock('../../icon/icon', () => jest.fn((props: React.ComponentProps<typeof Icon>) => <div>{props.icon}</div>));

describe('ArrowIndicator', () => {
    it('should render without an icon if value is undefined', () => {
        render(<ArrowIndicator />);
        expect(screen.getByTestId('dt_arrow_indicator')).toBeInTheDocument();
        expect(screen.queryByText('IcProfit')).not.toBeInTheDocument();
        expect(screen.queryByText('IcLoss')).not.toBeInTheDocument();
    });
    it('should render IcProfit if value has increased', () => {
        const { rerender } = render(<ArrowIndicator value='123.94' />);
        expect(screen.queryByText('IcProfit')).not.toBeInTheDocument();
        expect(screen.queryByText('IcLoss')).not.toBeInTheDocument();
        rerender(<ArrowIndicator value='123.95' />);
        expect(screen.getByText('IcProfit')).toBeInTheDocument();
        expect(screen.queryByText('IcLoss')).not.toBeInTheDocument();
    });
    it('should render IcLoss if value has decreased', () => {
        const { rerender } = render(<ArrowIndicator value='123.94' />);
        expect(screen.queryByText('IcProfit')).not.toBeInTheDocument();
        expect(screen.queryByText('IcLoss')).not.toBeInTheDocument();
        rerender(<ArrowIndicator value='123.93' />);
        expect(screen.queryByText('IcProfit')).not.toBeInTheDocument();
        expect(screen.getByText('IcLoss')).toBeInTheDocument();
    });
    it('should appear when the value changes, disappear after 3 seconds & reappear if value changes again', () => {
        jest.useFakeTimers();
        const { rerender } = render(<ArrowIndicator value='123.94' />);
        expect(screen.queryByText('IcProfit')).not.toBeInTheDocument();
        rerender(<ArrowIndicator value='123.95' />);
        expect(screen.getByText('IcProfit')).toBeInTheDocument();
        act(() => {
            jest.advanceTimersByTime(3000);
        });
        expect(screen.queryByText('IcProfit')).not.toBeInTheDocument();
        rerender(<ArrowIndicator value='123.92' />);
        expect(screen.getByText('IcLoss')).toBeInTheDocument();
        jest.useRealTimers();
    });
});
