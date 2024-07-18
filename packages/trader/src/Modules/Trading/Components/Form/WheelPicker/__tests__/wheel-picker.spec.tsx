import React from 'react';
import { render, screen } from '@testing-library/react';
import WheelPicker from '../wheel-picker';
import userEvent from '@testing-library/user-event';

describe('WheelPicker', () => {
    const options = [31, 35, 39];
    const mockOnBarrierClick = jest.fn();

    afterEach(() => {
        mockOnBarrierClick.mockClear();
    });

    it('renders correctly with the initial state', () => {
        render(<WheelPicker options={options} onClick={mockOnBarrierClick} />);
        expect(screen.getByText(31)).toBeInTheDocument();
    });

    it('calls onBarrierClick when the value changes', () => {
        render(<WheelPicker options={options} onClick={mockOnBarrierClick} />);

        const increaseButton = screen.getByTestId('up-btn');
        userEvent.click(increaseButton);
        expect(mockOnBarrierClick).toHaveBeenCalledWith(31);

        const decreaseButton = screen.getByTestId('down-btn');
        userEvent.click(decreaseButton);
        expect(mockOnBarrierClick).toHaveBeenCalledWith(35);
    });

    it('handles increase and decrease correctly', () => {
        render(<WheelPicker options={options} onClick={mockOnBarrierClick} />);

        const increaseButton = screen.getByTestId('up-btn');
        const decreaseButton = screen.getByTestId('down-btn');

        expect(screen.getByText(31)).toBeInTheDocument();

        userEvent.click(decreaseButton);
        expect(screen.getByText(35)).toBeInTheDocument();

        userEvent.click(decreaseButton);
        expect(screen.getByText(39)).toBeInTheDocument();

        userEvent.click(increaseButton);
        expect(screen.getByText(35)).toBeInTheDocument();

        userEvent.click(increaseButton);
        expect(screen.getByText(31)).toBeInTheDocument();
    });

    it('sets default value from props correctly', () => {
        const defaultValue = 39;
        render(<WheelPicker options={options} onClick={mockOnBarrierClick} defaultValue={defaultValue} />);

        expect(screen.getByText(39)).toBeInTheDocument();
    });
});
