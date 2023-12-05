import React from 'react';
import { render, screen } from '@testing-library/react';
import ArrowIndicator from '../arrow-indicator';
import Icon from '../../icon/icon';

jest.mock('../../icon/icon', () => jest.fn((props: React.ComponentProps<typeof Icon>) => <div>{props.icon}</div>));

describe('ArrowIndicator', () => {
    it('should not render if has_increased is undefined', () => {
        render(<ArrowIndicator />);
        expect(screen.queryByText('IcProfit')).not.toBeInTheDocument();
        expect(screen.queryByText('IcLoss')).not.toBeInTheDocument();
    });
    it('should not render if has_increased is null', () => {
        render(<ArrowIndicator has_increased={null} />);
        expect(screen.queryByText('IcProfit')).not.toBeInTheDocument();
        expect(screen.queryByText('IcLoss')).not.toBeInTheDocument();
    });
    it('should render IcProfit if has_increased is true', () => {
        render(<ArrowIndicator has_increased />);
        expect(screen.getByText('IcProfit')).toBeInTheDocument();
        expect(screen.queryByText('IcLoss')).not.toBeInTheDocument();
    });
    it('should render IcLoss if has_increased is false', () => {
        render(<ArrowIndicator has_increased={false} />);
        expect(screen.queryByText('IcProfit')).not.toBeInTheDocument();
        expect(screen.getByText('IcLoss')).toBeInTheDocument();
    });
});
