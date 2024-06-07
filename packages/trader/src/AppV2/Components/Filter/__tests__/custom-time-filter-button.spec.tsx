import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomDateFilterButton from '../custom-time-filter-button';

const customTimeRangeFilter = '25 May 2024';
const mockProps = {
    setShowDatePicker: jest.fn(),
};

describe('CustomDateFilterButton', () => {
    it('should render component with default props', () => {
        render(<CustomDateFilterButton {...mockProps} />);

        expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('should render component with customTimeRangeFilter if it was passed', () => {
        render(<CustomDateFilterButton {...mockProps} customTimeRangeFilter={customTimeRangeFilter} />);

        expect(screen.getByText(customTimeRangeFilter)).toBeInTheDocument();
    });

    it('should call setShowDatePicker if user clicks on the component', () => {
        render(<CustomDateFilterButton {...mockProps} />);

        userEvent.click(screen.getByText('Custom'));
        expect(mockProps.setShowDatePicker).toBeCalled();
    });
});
