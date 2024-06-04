import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toMoment } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import CompositeCalendar from '../composite-calendar';
import TwoMonthPicker from '../two-month-picker';

const mock_props = {
    input_date_range: {
        value: 'last_7_days',
        label: 'Last 7 days',
        duration: 7,
        onClick: jest.fn(),
    },
    from: 1696319493,
    onChange: jest.fn(),
    to: 1696928512,
};

jest.mock('../composite-calendar-mobile', () => jest.fn(() => <div>CompositeCalendarMobile</div>));

jest.mock('../two-month-picker', () => jest.fn(() => <div>TwoMonthPicker</div>));

describe('<CompositeCalendar />', () => {
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    );
    it('should render the component', () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        expect(screen.getByTestId('dt_calendar_input_from')).toBeInTheDocument();
        expect(screen.getByTestId('dt_calendar_input_to')).toBeInTheDocument();
    });
    it('should handle onclick for "from date" input', () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        const from_input = screen.getByTestId('dt_calendar_input_from');
        userEvent.click(from_input);
        expect(screen.getByText('Last 7 days')).toBeInTheDocument();
    });
    it('should handle onclick for "to date" input', () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        const to_input = screen.getByTestId('dt_calendar_input_to');
        userEvent.click(to_input);
        expect(screen.getByText('Last 7 days')).toBeInTheDocument();
    });
    it('should handle setToDate function click', async () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        const to_input = screen.getByTestId('dt_calendar_input_to');
        userEvent.click(to_input);
        act(() => {
            (TwoMonthPicker as unknown as jest.Mock).mock.calls[0][0].onChange();
        });
        await waitFor(() => {
            expect(mock_props.onChange).toHaveBeenCalled();
        });
    });
    it('should handle setFromDate function click', async () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        const from_input = screen.getByTestId('dt_calendar_input_from');
        userEvent.click(from_input);
        act(() => {
            (TwoMonthPicker as unknown as jest.Mock).mock.calls[0][0].onChange();
        });
        await waitFor(() => {
            expect(mock_props.onChange).toHaveBeenCalled();
        });
    });
    it('should handle onclick for "All time" option', () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        const from_input = screen.getByTestId('dt_calendar_input_from');
        userEvent.click(from_input);
        userEvent.click(screen.getByText('All time'));
        expect(mock_props.onChange).toHaveBeenCalled();
    });
    it('should handle onclick for "Today" option', () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        const from_input = screen.getByTestId('dt_calendar_input_from');
        userEvent.click(from_input);
        userEvent.click(screen.getByText('Today'));
        expect(mock_props.onChange).toHaveBeenCalled();
    });
    it('should handle onclick for "Last 7 days" option', () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        const from_input = screen.getByTestId('dt_calendar_input_from');
        userEvent.click(from_input);
        userEvent.click(screen.getByText('Last 7 days'));
        expect(mock_props.onChange).toHaveBeenCalled();
    });
    it('should handle onclick for "Last 30 days" option', () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        const from_input = screen.getByTestId('dt_calendar_input_from');
        userEvent.click(from_input);
        userEvent.click(screen.getByText('Last 30 days'));
        expect(mock_props.onChange).toHaveBeenCalled();
    });
    it('should handle onclick for "Last quarter" option', () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        const from_input = screen.getByTestId('dt_calendar_input_from');
        userEvent.click(from_input);
        userEvent.click(screen.getByText('Last quarter'));
        expect(mock_props.onChange).toHaveBeenCalled();
    });
    it('should disable date before from date in "to input" section ', () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        const to_input = screen.getByTestId('dt_calendar_input_to');
        userEvent.click(to_input);
        expect(
            (TwoMonthPicker as unknown as jest.Mock).mock.calls[0][0].getIsPeriodDisabled(toMoment('2023-10-02'))
        ).toBeTruthy();
    });
    it('should disable date after to date in "from input" section ', () => {
        render(<CompositeCalendar {...mock_props} />, { wrapper });
        const from_input = screen.getByTestId('dt_calendar_input_from');
        userEvent.click(from_input);
        expect(
            (TwoMonthPicker as unknown as jest.Mock).mock.calls[0][0].getIsPeriodDisabled(toMoment('2023-10-02'))
        ).toBeFalsy();
        expect(
            (TwoMonthPicker as unknown as jest.Mock).mock.calls[0][0].getIsPeriodDisabled(toMoment('2023-10-12'))
        ).toBeTruthy();
    });
});
