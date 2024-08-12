import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateRangePicker from '../date-picker';

const header = 'Choose a date range';
const footer = 'Apply';
const mockProps = {
    applyHandler: jest.fn(),
    isOpen: true,
    onClose: jest.fn(),
    setCustomTimeRangeFilter: jest.fn(),
    handleDateChange: jest.fn(),
};

describe('DateRangePicker', () => {
    it('should render Action Sheet with Date Picker', () => {
        render(<DateRangePicker {...mockProps} />);

        expect(screen.getByText(header)).toBeInTheDocument();
        expect(screen.getByText(footer)).toBeInTheDocument();
    });

    it('should call onClose if user clicks on overlay', () => {
        render(<DateRangePicker {...mockProps} />);

        userEvent.click(screen.getByTestId('dt-actionsheet-overlay'));
        expect(mockProps.onClose).toBeCalled();
    });

    it('should call setCustomTimeRangeFilter, handleDateChange and applyHandler if user choses some range date and clicks on Apply button', () => {
        render(<DateRangePicker {...mockProps} />);

        const fromDate = screen.getByText('1');
        const toDate = screen.getByText('2');
        const applyButton = screen.getByText(footer);
        userEvent.click(fromDate);
        userEvent.click(toDate);
        userEvent.click(applyButton);

        expect(mockProps.setCustomTimeRangeFilter).toBeCalled();
        expect(mockProps.handleDateChange).toBeCalled();
        expect(mockProps.applyHandler).toBeCalled();
    });

    it('should call setCustomTimeRangeFilter, handleDateChange and applyHandler if user choses a single date and clicks on Apply button', () => {
        render(<DateRangePicker {...mockProps} />);

        const fromDate = screen.getByText('1');
        const applyButton = screen.getByText(footer);
        userEvent.click(fromDate);
        userEvent.click(applyButton);

        expect(mockProps.setCustomTimeRangeFilter).toBeCalled();
        expect(mockProps.handleDateChange).toBeCalled();
        expect(mockProps.applyHandler).toBeCalled();
    });
});
