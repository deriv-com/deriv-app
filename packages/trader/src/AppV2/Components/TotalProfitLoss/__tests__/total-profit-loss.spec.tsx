import React from 'react';
import { render, screen } from '@testing-library/react';
import TotalProfitLoss from '../total-profit-loss';

const totalProfitLoss = 'Total profit/loss:';
const mockProps = {
    totalProfitLoss: 230.56,
};

describe('TotalProfitLoss', () => {
    it('should render component with default props', () => {
        render(<TotalProfitLoss {...mockProps} />);

        expect(screen.getByText(totalProfitLoss)).toBeInTheDocument();
        expect(screen.getByText(/230.56/)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
    });

    it('should render component with passed currency', () => {
        render(<TotalProfitLoss {...mockProps} currency='BYN' />);

        expect(screen.getByText(totalProfitLoss)).toBeInTheDocument();
        expect(screen.getByText(/BYN/i)).toBeInTheDocument();
    });

    it('should render component with another text and with specific className if hasBottomAlignment is true', () => {
        render(<TotalProfitLoss {...mockProps} hasBottomAlignment />);

        expect(screen.getByTestId('dt_total_profit_loss')).toHaveClass('total-profit-loss bottom');
        expect(screen.getByText(/Last contracts:/)).toBeInTheDocument();
    });

    it('should reflect correct amount of contracts in text if hasBottomAlignment is true and positionsCount was passed', () => {
        render(<TotalProfitLoss {...mockProps} hasBottomAlignment positionsCount={50} />);

        expect(screen.getByText(/Last 50 contracts:/)).toBeInTheDocument();
    });
});
