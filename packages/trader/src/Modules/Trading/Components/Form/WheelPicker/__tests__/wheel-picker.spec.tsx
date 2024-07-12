import React from 'react';
import { render, screen } from '@testing-library/react';
import WheelPicker from '../wheel-picker';
import userEvent from '@testing-library/user-event';

describe('WheelPicker', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const mockOnBarrierClick = jest.fn();

    afterEach(() => {
        mockOnBarrierClick.mockClear();
    });

    it('renders correctly with the initial state', () => {
        render(<WheelPicker options={options} onBarrierClick={mockOnBarrierClick} />);
        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('calls onBarrierClick when the value changes', () => {
        render(<WheelPicker options={options} onBarrierClick={mockOnBarrierClick} />);

        const increaseButton = screen.getByTestId('up-btn');
        userEvent.click(increaseButton);
        expect(mockOnBarrierClick).toHaveBeenCalledWith('Option 1');

        const decreaseButton = screen.getByTestId('down-btn');
        userEvent.click(decreaseButton);
        expect(mockOnBarrierClick).toHaveBeenCalledWith('Option 2');
    });

    it('handles increase and decrease correctly', () => {
        render(<WheelPicker options={options} onBarrierClick={mockOnBarrierClick} />);

        const increaseButton = screen.getByTestId('up-btn');
        const decreaseButton = screen.getByTestId('down-btn');

        expect(screen.getByText('Option 1')).toBeInTheDocument();

        userEvent.click(decreaseButton);
        expect(screen.getByText('Option 2')).toBeInTheDocument();

        userEvent.click(decreaseButton);
        expect(screen.getByText('Option 3')).toBeInTheDocument();

        userEvent.click(increaseButton);
        expect(screen.getByText('Option 2')).toBeInTheDocument();

        userEvent.click(increaseButton);
        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('sets default value from props correctly', () => {
        const defaultValue = 'Option 3';
        render(<WheelPicker options={options} onBarrierClick={mockOnBarrierClick} defaultValue={defaultValue} />);

        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
});
