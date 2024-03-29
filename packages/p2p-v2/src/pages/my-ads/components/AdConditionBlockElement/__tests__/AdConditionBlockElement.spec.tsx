import React from 'react';
import { render, screen } from '@testing-library/react';
import AdConditionBlockElement from '../AdConditionBlockElement';

describe('AdConditionBlockElement', () => {
    it('should render the component as expected', () => {
        render(<AdConditionBlockElement label='label' onClick={jest.fn()} value={1} />);
        expect(screen.getByRole('button', { name: 'label' })).toBeInTheDocument();
    });
    it('should handle the onClick for button', () => {
        const mockOnClick = jest.fn();
        render(<AdConditionBlockElement label='label' onClick={mockOnClick} value={1} />);
        screen.getByRole('button', { name: 'label' }).click();
        expect(mockOnClick).toHaveBeenCalledWith(1);
    });
});
