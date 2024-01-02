import React from 'react';
import moment from 'moment';
import { fireEvent, render, screen } from '@testing-library/react';
import { FlowTextField } from '../../FlowField';
import { FlowProvider } from '../../FlowProvider';
import DatePicker from '../DatePicker';

jest.mock('react-calendar/dist/Calendar.css', () => '');

const mockUseFlow = {
    setFormValues: jest.fn(),
};
jest.mock('../../FlowProvider', () => ({
    ...jest.requireActual('../../FlowProvider'),
    useFlow: jest.fn(() => mockUseFlow),
}));

describe('DatePicker Component', () => {
    test('should render with default props', () => {
        const mockOnDateChange = jest.fn();
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <FlowTextField name='test' />,
                }}
            >
                {() => <DatePicker name='Test Component' onDateChange={mockOnDateChange} />}
            </FlowProvider>
        );

        expect(screen.getByTestId('wallets_datepicker_button')).toBeInTheDocument();
    });

    test('should open and close calendar on button click', () => {
        const mockOnDateChange = jest.fn();
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <FlowTextField name='test' />,
                }}
            >
                {() => <DatePicker name='Test Component' onDateChange={mockOnDateChange} />}
            </FlowProvider>
        );

        const calendarButton = screen.getByTestId('wallets_datepicker_button');
        fireEvent.click(calendarButton);
        expect(screen.getByTestId('wallets_datepicker_container')).toBeInTheDocument();

        fireEvent.click(calendarButton);
        expect(screen.queryByTestId('wallets_datepicker_container')).not.toBeInTheDocument();
    });

    test('should render with mobileAlignment "above"', () => {
        const mockOnDateChange = jest.fn();
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <FlowTextField name='test' />,
                }}
            >
                {() => <DatePicker mobileAlignment='above' name='Test Component' onDateChange={mockOnDateChange} />}
            </FlowProvider>
        );

        const calendarButton = screen.getByTestId('wallets_datepicker_button');
        fireEvent.click(calendarButton);

        const container = screen.getByTestId('wallets_datepicker_container');
        expect(screen.getByTestId('wallets_datepicker_container')).toBeInTheDocument();
        expect(container).toHaveClass('above');
    });

    test('should trigger onDateChange callback with correct date when date is selected', () => {
        const mockOnDateChange = jest.fn();
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <FlowTextField name='test' />,
                }}
            >
                {() => <DatePicker name='Test Component' onDateChange={mockOnDateChange} />}
            </FlowProvider>
        );

        const calendarButton = screen.getByTestId('wallets_datepicker_button');
        fireEvent.click(calendarButton);
        fireEvent.click(screen.getByText('›'));

        const testDay = '15';
        const dateElement = screen.getByText(testDay);
        fireEvent.click(dateElement);
        const testDate = `${moment().add(1, 'month').format('YYYY')}-${moment()
            .add(1, 'month')
            .format('MM')}-${testDay}`;

        expect(mockOnDateChange).toHaveBeenCalledWith(testDate);
    });

    test('should close calendar on click outside of the component', () => {
        const mockOnDateChange = jest.fn();
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <FlowTextField name='test' />,
                }}
            >
                {() => <DatePicker name='Test Component' onDateChange={mockOnDateChange} />}
            </FlowProvider>
        );

        fireEvent.mouseDown(document.body);
        expect(screen.queryByTestId('wallets_datepicker_container')).not.toBeInTheDocument();

        const calendarButton = screen.getByTestId('wallets_datepicker_button');
        fireEvent.click(calendarButton);
        fireEvent.mouseDown(document.body);

        expect(screen.queryByTestId('wallets_datepicker_container')).not.toBeInTheDocument();
    });
});
