import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { Unverified } from '../unverified';

describe('<Unverified/>', () => {
    const mockOnReSubmit = jest.fn();
    it('should render Unverified component and trigger click', () => {
        render(<Unverified onReSubmit={mockOnReSubmit} />);
        expect(screen.getByText('Proof of income verification failed')).toBeInTheDocument();
        expect(screen.getByText('We were unable to verify your proof of income.')).toBeInTheDocument();
        const btn = screen.getByRole('button', { name: /try again/i });
        fireEvent.click(btn);
        expect(mockOnReSubmit).toHaveBeenCalled();
    });
});
