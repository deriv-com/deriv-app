import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Unverified } from '../Unverified';

describe('<Unverified/>', () => {
    it('should render Unverified component', () => {
        const mockOnClick = jest.fn();

        render(<Unverified onClick={mockOnClick} />);

        expect(screen.getByText('We could not verify your proof of address')).toBeInTheDocument();
        expect(screen.getByText('Please check your email for details.')).toBeInTheDocument();
        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent('Resubmit');
        fireEvent.click(btn);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
