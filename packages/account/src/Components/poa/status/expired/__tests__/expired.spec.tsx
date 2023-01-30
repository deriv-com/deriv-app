import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { Expired } from '../expired';

describe('<Expired/>', () => {
    const message = 'New proof of address is needed';
    const text = 'Your documents for proof of address is expired. Please submit again.';

    it('should render Expired component', () => {
        const mockOnClick = jest.fn();

        render(<Expired onClick={mockOnClick} />);

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText(text)).toBeInTheDocument();
        expect(screen.getByText('Resubmit')).toBeInTheDocument();
        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
