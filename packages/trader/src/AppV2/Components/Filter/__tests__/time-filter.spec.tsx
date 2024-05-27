import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeFilter from '../time-filter';

const defaultFilterName = 'All time';
const mockProps = {
    handleDateChange: jest.fn(),
    setTimeFilter: jest.fn(),
    setCustomTimeRangeFilter: jest.fn(),
    setNoMatchesFound: jest.fn(),
};
const mediaQueryList = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);

describe('TimeFilter', () => {
    it('should change data-state of the dropdown if user clicks on the filter', () => {
        render(<TimeFilter {...mockProps} />);

        const dropdownChevron = screen.getByTestId('dt_chevron');
        expect(dropdownChevron).toHaveAttribute('data-state', 'close');

        userEvent.click(dropdownChevron);
        expect(dropdownChevron).toHaveAttribute('data-state', 'open');
    });

    it('should render correct chip name if user have not chosen anything else', () => {
        render(<TimeFilter {...mockProps} />);

        expect(screen.getAllByText(defaultFilterName)).toHaveLength(2);
    });
});
