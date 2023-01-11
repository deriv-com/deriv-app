import React from 'react';
import { render, screen } from '@testing-library/react';
import CloseButton from '../close-button.jsx';

const mockFunction = jest.fn();
const MockCloseButton = () => <CloseButton className='test-class' onClick={mockFunction} />;

describe('CloseButton component', () => {
    it('should render the CloseButton component', () => {
        render(<MockCloseButton />);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeInTheDocument();
    });

    it('the button should has the "test-class" className', () => {
        render(<MockCloseButton />);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveClass('test-class');
    });
});
