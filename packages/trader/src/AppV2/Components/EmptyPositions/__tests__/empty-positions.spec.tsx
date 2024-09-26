import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyPositions from '../empty-positions';

describe('EmptyPositions', () => {
    const iconId = 'dt_empty_state_icon';

    it('should render "No open trades" content when isClosedTab prop is false', () => {
        render(<EmptyPositions />);
        expect(screen.getByText('No open positions')).toBeInTheDocument();
        expect(screen.getByText('Your open positions will appear here.')).toBeInTheDocument();
    });

    it('should render "No closed trades" content when isClosedTab prop is true', () => {
        render(<EmptyPositions isClosedTab />);
        expect(screen.getByText('No closed positions')).toBeInTheDocument();
        expect(screen.getByText('Your closed positions will be shown here.')).toBeInTheDocument();
    });

    it('should render "No matches found" content when noMatchesFound prop is true', () => {
        render(<EmptyPositions noMatchesFound />);
        expect(screen.getByText('No matches found')).toBeInTheDocument();
        expect(screen.getByText(/Try changing or removing filters/i)).toBeInTheDocument();
    });

    it('should render an empty state icon regardless of props', () => {
        const { rerender } = render(<EmptyPositions />);
        expect(screen.getByTestId(iconId)).toBeInTheDocument();

        rerender(<EmptyPositions isClosedTab />);
        expect(screen.getByTestId(iconId)).toBeInTheDocument();

        rerender(<EmptyPositions noMatchesFound />);
        expect(screen.getByTestId(iconId)).toBeInTheDocument();
    });
});
