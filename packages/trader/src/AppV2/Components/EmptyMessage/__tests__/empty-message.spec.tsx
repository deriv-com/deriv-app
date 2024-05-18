import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import EmptyMessage from '../empty-message';

describe('EmptyMessage', () => {
    const startTradingButtonLabel = 'Start trading';
    const iconId = 'dt_empty_state_icon';

    it('should render "No open positions" content with button when isClosedTab prop is false', () => {
        render(<EmptyMessage />);
        expect(screen.getByText('No open positions')).toBeInTheDocument();
        expect(screen.getByText('Ready to open a position?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: startTradingButtonLabel })).toBeInTheDocument();
    });

    it('should render "No closed positions" content when isClosedTab prop is true', () => {
        render(<EmptyMessage isClosedTab />);
        expect(screen.getByText('No closed positions')).toBeInTheDocument();
        expect(screen.getByText('Your completed trades will appear here.')).toBeInTheDocument();
    });

    it('should render "No matches found" content when noMatchesFound prop is true', () => {
        render(<EmptyMessage noMatchesFound />);
        expect(screen.getByText('No matches found')).toBeInTheDocument();
        expect(screen.getByText(/Try changing or removing filters/i)).toBeInTheDocument();
    });

    it('should render an empty state icon regardless of props', () => {
        const { rerender } = render(<EmptyMessage />);
        expect(screen.getByTestId(iconId)).toBeInTheDocument();
        rerender(<EmptyMessage isClosedTab />);
        expect(screen.getByTestId(iconId)).toBeInTheDocument();
        rerender(<EmptyMessage noMatchesFound />);
        expect(screen.getByTestId(iconId)).toBeInTheDocument();
    });

    it('should call onRedirectToTrade when "Start trading" button is clicked', () => {
        const mockOnRedirectToTrade = jest.fn();
        render(<EmptyMessage onRedirectToTrade={mockOnRedirectToTrade} />);
        const startTradingButton = screen.getByRole('button', { name: startTradingButtonLabel });
        userEvent.click(startTradingButton);
        expect(mockOnRedirectToTrade).toHaveBeenCalled();
    });
});
