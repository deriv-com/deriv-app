import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import TogglePositions from '../toggle-positions';

const default_props = {
    is_open: false,
    positions_count: 0,
    togglePositions: jest.fn(),
};

describe('TogglePositions component', () => {
    it('should have "positions-toggle--active" class when "is_open" is "true"', () => {
        render(<TogglePositions {...default_props} is_open />);
        expect(screen.getByTestId('dt_positions_toggle')).toHaveClass('positions-toggle--active');
    });

    it('should have "positions-toggle--has-count" class when "positions_count > 0"', () => {
        render(<TogglePositions {...default_props} positions_count={4} />);
        expect(screen.getByTestId('dt_positions_toggle')).toHaveClass('positions-toggle--has-count');
    });

    it('should call "togglePositions" when the user clicked on the link', () => {
        const mockTogglePositions = jest.fn();
        render(<TogglePositions {...default_props} togglePositions={mockTogglePositions} />);
        const link = screen.getByTestId('dt_positions_toggle');
        userEvent.click(link);
        expect(mockTogglePositions).toHaveBeenCalledTimes(1);
    });

    it('should render "IcPortfolio" icon', () => {
        render(<TogglePositions {...default_props} />);
        expect(screen.getByTestId('dt_icon')).toBeVisible();
    });
});
