import React from 'react';
import { act, render, screen } from '@testing-library/react';
import EmptyPositions from '../empty-positions';

describe('EmptyPositions', () => {
    const iconId = 'dt_empty_state_icon';

    it('should render Loader before timer ends', () => {
        render(<EmptyPositions />);

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should render "No open trades" content when isClosedTab prop is false', () => {
        jest.useFakeTimers();
        render(<EmptyPositions />);

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(screen.getByText('No open trades')).toBeInTheDocument();
        expect(screen.getByText('Your open trades will appear here.')).toBeInTheDocument();
    });

    it('should render "No closed trades" content when isClosedTab prop is true', () => {
        jest.useFakeTimers();
        render(<EmptyPositions isClosedTab />);

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(screen.getByText('No closed trades')).toBeInTheDocument();
        expect(screen.getByText('Your closed trades will be shown here.')).toBeInTheDocument();
    });

    it('should render "No matches found" content when noMatchesFound prop is true', () => {
        jest.useFakeTimers();
        render(<EmptyPositions noMatchesFound />);

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(screen.getByText('No matches found')).toBeInTheDocument();
        expect(screen.getByText(/Try changing or removing filters/i)).toBeInTheDocument();
    });

    it('should render an empty state icon regardless of props', () => {
        jest.useFakeTimers();
        const { rerender } = render(<EmptyPositions />);

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(screen.getByTestId(iconId)).toBeInTheDocument();
        rerender(<EmptyPositions isClosedTab />);
        expect(screen.getByTestId(iconId)).toBeInTheDocument();
        rerender(<EmptyPositions noMatchesFound />);
        expect(screen.getByTestId(iconId)).toBeInTheDocument();
    });
});
