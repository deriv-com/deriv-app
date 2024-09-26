import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WheelPicker from '../wheel-picker';
import userEvent from '@testing-library/user-event';

const options = ['10', '20', '30', '40'];
const mockOnClick = jest.fn();

const renderComponent = (defaultValue: string) => {
    return render(<WheelPicker options={options} onClick={mockOnClick} defaultValue={defaultValue} currency='USD' />);
};

describe('WheelPicker Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render component with default value', () => {
        renderComponent('20');
        expect(screen.getByText('20 USD')).toBeInTheDocument();
        expect(screen.getByText('10 USD')).toBeInTheDocument();
        expect(screen.getByText('30 USD')).toBeInTheDocument();
    });

    test('should call onClick with the correct value when up button is clicked', () => {
        renderComponent('20');
        const upButton = screen.getByTestId('dt_up_btn');
        userEvent.click(upButton);
        expect(mockOnClick).toHaveBeenCalledWith('10');
    });

    test('should call onClick with the correct value when down button is clicked', () => {
        renderComponent('20');
        const downButton = screen.getByTestId('dt_down_btn');
        userEvent.click(downButton);
        expect(mockOnClick).toHaveBeenCalledWith('30');
    });

    test('should disable up button when at the first option', () => {
        renderComponent('10');
        const upButton = screen.getByTestId('dt_up_btn');
        expect(upButton).toBeDisabled();
    });

    test('should disable down button when at the last option', () => {
        renderComponent('40');
        const downButton = screen.getByTestId('dt_down_btn');
        expect(downButton).toBeDisabled();
    });

    test('should update selected index correctly when options change', () => {
        const { rerender } = renderComponent('20');
        expect(screen.getByText('20 USD')).toBeInTheDocument();
        rerender(<WheelPicker options={['50', '60', '70']} onClick={mockOnClick} defaultValue='60' currency='USD' />);
        expect(screen.getByText('60 USD')).toBeInTheDocument();
    });
});
