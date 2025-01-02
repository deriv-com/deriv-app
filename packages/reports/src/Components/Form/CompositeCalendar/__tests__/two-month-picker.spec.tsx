import React from 'react';
import moment from 'moment';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TwoMonthPicker from '../two-month-picker';

describe('TwoMonthPicker', () => {
    const mockProps = {
        onChange: jest.fn(),
        isPeriodDisabled: jest.fn(),
        value: moment(),
    };

    it('should render TwoMonthPicker component', () => {
        render(<TwoMonthPicker {...mockProps} />);
        const currentMonth = moment().format('MMM');
        const prevMonth = moment().subtract(1, 'month').format('MMM');
        const currentYear = moment().format('YYYY');
        expect(screen.getByText(prevMonth)).toBeInTheDocument();
        expect(screen.getByText(currentMonth)).toBeInTheDocument();
        expect(screen.getByText(currentYear)).toBeInTheDocument();
    });
    it('should call onChange when a date is selected', async () => {
        render(<TwoMonthPicker {...mockProps} />);
        const prevMonthDate = moment().date(1).subtract(1, 'month');
        const prevMonthDateElement = screen.getAllByText(prevMonthDate.date())[0];
        const prevMonthFullDate = prevMonthDate.format('YYYY-MM-DD');
        await userEvent.click(prevMonthDateElement);
        expect(mockProps.onChange).toHaveBeenCalledWith(moment.utc(prevMonthFullDate, 'YYYY-MM-DD'));
    });
    it('should jump to current month from previous months upon clicking today button', async () => {
        render(<TwoMonthPicker {...mockProps} />);
        const currentMonth = moment().format('MMM');
        const monthBeforePrevious = moment().subtract(2, 'month').format('MMM');
        const prevMonth = moment().subtract(1, 'month').format('MMM');
        const prevMonthButton = screen.getByTestId('dt_calendar_icon_IcChevronLeft');
        const todayButton = screen.getByTestId('dt_calendar_icon_IcCalendarForwardToday');

        // go to previous months
        await userEvent.click(prevMonthButton);
        expect(screen.getByText(monthBeforePrevious)).toBeInTheDocument();
        expect(screen.getByText(prevMonth)).toBeInTheDocument();

        // jump to current month
        await userEvent.click(todayButton);
        expect(screen.queryByText(monthBeforePrevious)).not.toBeInTheDocument();
        expect(screen.getByText(prevMonth)).toBeInTheDocument();
        expect(screen.getByText(currentMonth)).toBeInTheDocument();
    });
});
