import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarRadioButton from '../calendar-radio-button';

const mock_props = {
    id: '1',
    value: 'all_time',
    label: 'All time',
    onChange: jest.fn(),
};

describe('CalendarRadioButton', () => {
    it('should render the radio button', () => {
        render(<CalendarRadioButton {...mock_props} />);
        expect(screen.getByText('All time')).toBeInTheDocument();
    });
    it('should handle on click of radio button', () => {
        render(<CalendarRadioButton {...mock_props} />);
        userEvent.click(screen.getByText('All time'));
        expect(mock_props.onChange).toHaveBeenCalled();
    });
});
