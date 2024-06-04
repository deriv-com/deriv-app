import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddNewButton from '../AddNewButton';

describe('AddNewButton', () => {
    it('should render the component correctly', () => {
        render(<AddNewButton isMobile={true} onAdd={jest.fn()} />);
        expect(screen.getByText('Add new')).toBeInTheDocument();
    });
    it('should handle the onadd action', () => {
        const mockOnAdd = jest.fn();
        render(<AddNewButton isMobile={true} onAdd={mockOnAdd} />);
        userEvent.click(screen.getByText('Add new'));
        expect(mockOnAdd).toHaveBeenCalled();
    });
});
