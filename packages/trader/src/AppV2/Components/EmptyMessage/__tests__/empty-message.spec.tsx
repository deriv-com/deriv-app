import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyMessage from '../empty-message';

describe('EmptyMessage', () => {
    const iconId = 'dt_empty_state_icon';

    it('should render "No open positions" content when isClosedTab prop is false', () => {
        render(<EmptyMessage />);
        expect(screen.getByText('No open positions')).toBeInTheDocument();
        expect(screen.getByText('Your open trades will appear here.')).toBeInTheDocument();
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
});
