import React from 'react';
import MyAdsToggle from '../MyAdsToggle';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockProps = {
    isPaused: false,
    onClickToggle: jest.fn(),
};

describe('MyAdsToggle', () => {
    it('should render the MyAdsToggle component', () => {
        render(<MyAdsToggle {...mockProps} />);
        expect(screen.getByText('Hide my ads')).toBeInTheDocument();
        const input: HTMLInputElement = screen.getByRole('checkbox');
        expect(input.checked).toBe(false);
    });
    it('should be on when isPaused is true', () => {
        const newProps = { ...mockProps, isPaused: true };
        render(<MyAdsToggle {...newProps} />);
        const input: HTMLInputElement = screen.getByRole('checkbox');
        expect(input.checked).toBe(true);
    });
    it('should handle onclick toggle', () => {
        render(<MyAdsToggle {...mockProps} />);
        const input: HTMLInputElement = screen.getByRole('checkbox');
        userEvent.click(input);
        expect(mockProps.onClickToggle).toHaveBeenCalled();
    });
});
