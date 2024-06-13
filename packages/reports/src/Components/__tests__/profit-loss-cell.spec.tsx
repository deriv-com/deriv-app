import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfitLossCell from '../profit-loss-cell';

const mockChild = 'mockChild';
const mockProps = {
    value: '+23,06',
    children: mockChild,
};

describe('ProfitLossCell', () => {
    it('should render passed children', () => {
        render(<ProfitLossCell {...mockProps} />);

        expect(screen.getByText(mockChild)).toBeInTheDocument();
    });

    it('should render passed children with correct className if passed value >= 0', () => {
        render(<ProfitLossCell {...mockProps} />);

        expect(screen.getByText(mockChild)).toHaveClass('amount--profit');
    });

    it('should render passed children with correct className if passed value < 0', () => {
        render(<ProfitLossCell {...mockProps} value='-0,34' />);

        expect(screen.getByText(mockChild)).toHaveClass('amount--loss');
    });
});
