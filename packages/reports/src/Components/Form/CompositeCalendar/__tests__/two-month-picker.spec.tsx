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

    describe('should render TwoMonthPicker component', () => {
        it('should render TwoMonthPicker component with different years for December/January months', () => {
            const january_10th_2025 = moment('2025-01-10', 'YYYY-MM-DD');

            render(<TwoMonthPicker {...mockProps} value={january_10th_2025} />);

            const currentMonth = moment().month(0).format('MMM'); // January
            const prevMonth = moment().month(0).subtract(1, 'month').format('MMM'); // December
            const currentYear = moment().year(2025).format('YYYY'); // 2025
            const prevYear = moment().year(2024).format('YYYY'); // 2024

            expect(screen.getByText(currentMonth)).toBeInTheDocument();
            expect(screen.getByText(prevMonth)).toBeInTheDocument();
            expect(screen.getByTestId('first-month')).toHaveTextContent(prevYear);
            expect(screen.getByTestId('second-month')).toHaveTextContent(currentYear);
        });

        it('should render TwoMonthPicker component with same years for January/February months', () => {
            const february_10th_2025 = moment('2025-02-10', 'YYYY-MM-DD');

            render(<TwoMonthPicker {...mockProps} value={february_10th_2025} />);

            const currentMonth = moment().month(1).format('MMM'); // February
            const prevMonth = moment().month(1).subtract(1, 'month').format('MMM'); // January
            const currentYear = moment().year(2025).format('YYYY'); // 2025
            const prevYear = moment().year(2025).format('YYYY'); // 2025

            expect(screen.getByText(currentMonth)).toBeInTheDocument();
            expect(screen.getByText(prevMonth)).toBeInTheDocument();
            expect(screen.getByTestId('first-month')).toHaveTextContent(prevYear);
            expect(screen.getByTestId('second-month')).toHaveTextContent(currentYear);
        });
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
