import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CFDPasswordSuccessMessage from '../cfd-password-success-message';

const mockToggleModal = jest.fn();

describe('CFDPasswordSuccessMessage', () => {
    it('should call toggleModal function when the button is clicked', () => {
        const mockToggleModal = jest.fn();
        render(<CFDPasswordSuccessMessage toggleModal={mockToggleModal} is_investor={false} />);
        const button = screen.getByRole('button', { name: /OK/i });
        fireEvent.click(button);
        expect(mockToggleModal).toHaveBeenCalledTimes(1);
    });

    it('should show success text for investor when is_investor is true', () => {
        render(<CFDPasswordSuccessMessage toggleModal={mockToggleModal} is_investor={true} />);
        expect(screen.getByText(/Your investor password has been changed./i)).toBeInTheDocument();
    });

    it('should show generic success text when is_investor is false', () => {
        render(<CFDPasswordSuccessMessage toggleModal={mockToggleModal} is_investor={false} />);
        expect(screen.getByText(/Your password has been changed./i)).toBeInTheDocument();
    });
});
