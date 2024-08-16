import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeFilter from '../time-filter';

const defaultFilterName = 'All time';
const datePickerComponentText = 'Choose a date range';
const mockProps = {
    handleDateChange: jest.fn(),
    setTimeFilter: jest.fn(),
    setCustomTimeRangeFilter: jest.fn(),
    setNoMatchesFound: jest.fn(),
};

describe('TimeFilter', () => {
    it('should change data-state of the dropdown if user clicks on the filter', () => {
        render(<TimeFilter {...mockProps} />);

        const dropdownChevron = screen.getAllByRole('img')[0];
        expect(dropdownChevron).toHaveAttribute('data-state', 'close');

        userEvent.click(screen.getAllByText(defaultFilterName)[0]);
        expect(dropdownChevron).toHaveAttribute('data-state', 'open');
    });

    it('should render correct chip name if user have not chosen anything else', () => {
        render(<TimeFilter {...mockProps} />);

        expect(screen.getByText(defaultFilterName)).toBeInTheDocument();
    });

    it('should call setTimeFilter with corresponding value if user clicks on "Today"', () => {
        render(<TimeFilter {...mockProps} />);

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getByText('Today'));

        expect(mockProps.setTimeFilter).toHaveBeenCalledWith('Today');
    });

    it('should call setTimeFilter with corresponding value if user clicks on "Yesterday"', () => {
        render(<TimeFilter {...mockProps} />);

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getByText('Yesterday'));

        expect(mockProps.setTimeFilter).toHaveBeenCalledWith('Yesterday');
    });

    it('should call setTimeFilter with corresponding value if user clicks on "Last 60 days"', () => {
        render(<TimeFilter {...mockProps} />);

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getByText('Last 60 days'));

        expect(mockProps.setTimeFilter).toHaveBeenCalledWith('60');
    });

    it('should call setTimeFilter and setCustomTimeRangeFilter with empty string if user clicks on "All time"', () => {
        render(<TimeFilter {...mockProps} timeFilter='30' />);

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getByText('All time'));

        expect(mockProps.setTimeFilter).toHaveBeenCalledWith('');
    });

    it('should show Date Picker if user clicks on "Custom" button', () => {
        render(<TimeFilter {...mockProps} />);

        userEvent.click(screen.getByRole('button'));
        expect(screen.queryByText(datePickerComponentText)).not.toBeInTheDocument();
        userEvent.click(screen.getByText('Custom'));

        expect(screen.getByText(datePickerComponentText)).toBeInTheDocument();
    });

    it('should close Date Picker if it was shown after user clicks on overlay', () => {
        render(<TimeFilter {...mockProps} />);

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getByText('Custom'));
        expect(screen.getByText(datePickerComponentText)).toBeInTheDocument();

        userEvent.click(screen.getAllByTestId('dt-actionsheet-overlay')[1]);
        expect(screen.queryByText(datePickerComponentText)).not.toBeInTheDocument();
    });
});
