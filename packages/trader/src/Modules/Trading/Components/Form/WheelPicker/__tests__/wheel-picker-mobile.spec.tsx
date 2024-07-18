import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import WheelPickerMobile from '../wheel-picker-mobile';
import userEvent from '@testing-library/user-event';

describe('WheelPickerMobile', () => {
    const options = [0.12, 0.21, 0.23, 0.34, 0.33, 0.38, 0.09, 0.76, 0.77, 0.78, 0.79];
    const mockOnChange = jest.fn();

    afterEach(() => {
        mockOnChange.mockClear();
    });

    it('renders correctly with the initial state', () => {
        render(
            <WheelPickerMobile currency='usd' options={options} onChange={mockOnChange} defaultValue={options[3]} />
        );
        expect(screen.getByText(0.34)).toBeInTheDocument();
    });

    it('calls onChange when the value changes via swipe', () => {
        render(
            <WheelPickerMobile currency='usd' options={options} onChange={mockOnChange} defaultValue={options[3]} />
        );
        // eslint-disable-next-line testing-library/no-node-access
        const pickerContainer = screen.getByText('0.34').closest('.picker-viewport') as HTMLElement;

        if (pickerContainer) {
            const { getByText } = within(pickerContainer);

            const initialPicker = getByText(0.34);

            fireEvent.touchStart(initialPicker, { touches: [{ clientY: 0 }] });
            fireEvent.touchMove(initialPicker, { touches: [{ clientY: 10 }] });
            fireEvent.touchEnd(initialPicker);

            expect(mockOnChange).toHaveBeenCalledWith(0.34);
        }
    });

    it('sets default value from props correctly', () => {
        const defaultValue = 0.09;

        render(
            <WheelPickerMobile currency='usd' options={options} onChange={mockOnChange} defaultValue={defaultValue} />
        );
        expect(screen.getByText(0.09)).toBeInTheDocument();
    });

    it('updates the selected index when an option is clicked', () => {
        render(
            <WheelPickerMobile currency='usd' options={options} onChange={mockOnChange} defaultValue={options[3]} />
        );

        userEvent.click(screen.getByText('0.76'));
        expect(mockOnChange).toHaveBeenCalledWith(0.76);
    });

    it('calls onChange when the value changes via click', () => {
        render(
            <WheelPickerMobile currency='usd' options={options} onChange={mockOnChange} defaultValue={options[3]} />
        );

        userEvent.click(screen.getByText('0.38'));
        expect(mockOnChange).toHaveBeenCalledWith(0.38);
    });
});
