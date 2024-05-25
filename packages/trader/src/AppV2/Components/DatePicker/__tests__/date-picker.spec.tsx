import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateRangePicker from '../date-picker';

const header = 'Choose a date range';
const footer = 'Apply';
const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    setCustomTimeRangeFilter: jest.fn(),
    handleDateChange: jest.fn(),
};
const mediaQueryList = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);

describe('DateRangePicker', () => {
    it('should render Action Sheet with Date Picker', () => {
        render(<DateRangePicker {...mockProps} />);

        expect(screen.getByText(header)).toBeInTheDocument();
        expect(screen.getByText(footer)).toBeInTheDocument();
    });

    it('should call setCustomTimeRangeFilter, handleDateChange and onClose if user choses some range date and clicks on Apply button', () => {
        render(<DateRangePicker {...mockProps} />);

        const fromDate = screen.getByText('1');
        const toDate = screen.getByText('2');
        const applyButton = screen.getByText(footer);
        userEvent.click(fromDate);
        userEvent.click(toDate);
        userEvent.click(applyButton);

        expect(mockProps.setCustomTimeRangeFilter).toBeCalled();
        expect(mockProps.handleDateChange).toBeCalled();
        expect(mockProps.onClose).toBeCalled();
    });
});
