import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toMoment } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import Loadable from 'react-loadable';
import TwoMonthPicker from '../two-month-picker';
import CompositeCalendar from '../composite-calendar';

const twoMonthPickerComponent = 'TwoMonthPicker';
const inputDataFromPlaceholderText = 'Date from';
const inputDataToPlaceholderText = 'Date to';
const sideListLabels = ['All time', 'Last 7 days', 'Last 30 days', 'Last 60 days', 'Last quarter'];
const endOfTheDay = toMoment().endOf('day');
const getDateFromNow = (daysFromNow: number) =>
    daysFromNow ? toMoment().startOf('day').subtract(daysFromNow, 'day').add(1, 's') : undefined;
const mockDefaultProps = {
    from: 1696319493,
    onChange: jest.fn(),
    to: 1696928512,
};

jest.mock('../composite-calendar-mobile', () => jest.fn(() => <div>CompositeCalendarMobile</div>));
jest.mock('../two-month-picker', () => jest.fn(() => <div>{twoMonthPickerComponent}</div>));

Loadable.preloadAll();

describe('<CompositeCalendar />', () => {
    const mockCompositeCalendar = () => (
        <StoreProvider store={mockStore({})}>
            <CompositeCalendar {...mockDefaultProps} />
        </StoreProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render component with default props', () => {
        render(mockCompositeCalendar());

        expect(screen.getByPlaceholderText(inputDataFromPlaceholderText)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(inputDataToPlaceholderText)).toBeInTheDocument();
    });

    it('should render TwoMonthPicker component and side list with options if user clicks on "from date" input', () => {
        render(mockCompositeCalendar());

        sideListLabels.forEach(item => expect(screen.queryByText(item)).not.toBeInTheDocument());
        expect(screen.queryByText(twoMonthPickerComponent)).not.toBeInTheDocument();

        userEvent.click(screen.getByPlaceholderText(inputDataFromPlaceholderText));

        sideListLabels.forEach(item => expect(screen.getByText(item)).toBeInTheDocument());
        expect(screen.getByText(twoMonthPickerComponent)).toBeInTheDocument();
    });

    it('should render TwoMonthPicker component and side list with options if user clicks on "to date" input', () => {
        render(mockCompositeCalendar());

        sideListLabels.forEach(item => expect(screen.queryByText(item)).not.toBeInTheDocument());
        expect(screen.queryByText(twoMonthPickerComponent)).not.toBeInTheDocument();

        userEvent.click(screen.getByPlaceholderText(inputDataToPlaceholderText));

        sideListLabels.forEach(item => expect(screen.getByText(item)).toBeInTheDocument());
        expect(screen.getByText(twoMonthPickerComponent)).toBeInTheDocument();
    });

    it('should call onChange function if onChange is triggered from TwoMonthPicker component after user clicks on input "date to"', async () => {
        render(mockCompositeCalendar());

        userEvent.click(screen.getByPlaceholderText(inputDataToPlaceholderText));
        act(() => {
            (TwoMonthPicker as unknown as jest.Mock).mock.calls[0][0].onChange();
        });

        await waitFor(() => {
            expect(mockDefaultProps.onChange).toHaveBeenCalled();
        });
    });

    it('should call onChange function if onChange is triggered from TwoMonthPicker component after user clicks on input "date from"', async () => {
        render(mockCompositeCalendar());

        userEvent.click(screen.getByPlaceholderText(inputDataFromPlaceholderText));
        act(() => {
            (TwoMonthPicker as unknown as jest.Mock).mock.calls[0][0].onChange();
        });

        await waitFor(() => {
            expect(mockDefaultProps.onChange).toHaveBeenCalled();
        });
    });

    it('should call onChange function for "All time" option with correct arguments', () => {
        render(mockCompositeCalendar());

        userEvent.click(screen.getByPlaceholderText(inputDataFromPlaceholderText));
        userEvent.click(screen.getByText(sideListLabels[0]));

        expect(mockDefaultProps.onChange).toHaveBeenCalled();
        expect(mockDefaultProps.onChange).toHaveBeenCalledWith({
            from: getDateFromNow(0),
            to: endOfTheDay,
            is_batch: true,
        });
    });

    it('should call onChange function for "Last 7 days" option with correct arguments', () => {
        render(mockCompositeCalendar());

        userEvent.click(screen.getByPlaceholderText(inputDataFromPlaceholderText));
        userEvent.click(screen.getByText(sideListLabels[1]));

        expect(mockDefaultProps.onChange).toHaveBeenCalled();
        expect(mockDefaultProps.onChange).toHaveBeenCalledWith({
            from: getDateFromNow(7),
            to: endOfTheDay,
            is_batch: true,
        });
    });

    it('should call onChange function for "Last 30 days" option with correct arguments', () => {
        render(mockCompositeCalendar());

        userEvent.click(screen.getByPlaceholderText(inputDataFromPlaceholderText));
        userEvent.click(screen.getByText(sideListLabels[2]));

        expect(mockDefaultProps.onChange).toHaveBeenCalled();
        expect(mockDefaultProps.onChange).toHaveBeenCalledWith({
            from: getDateFromNow(30),
            to: endOfTheDay,
            is_batch: true,
        });
    });

    it('should call onChange function for "Last 60 days" option with correct arguments', () => {
        render(mockCompositeCalendar());

        userEvent.click(screen.getByPlaceholderText(inputDataFromPlaceholderText));
        userEvent.click(screen.getByText(sideListLabels[3]));

        expect(mockDefaultProps.onChange).toHaveBeenCalled();
        expect(mockDefaultProps.onChange).toHaveBeenCalledWith({
            from: getDateFromNow(60),
            to: endOfTheDay,
            is_batch: true,
        });
    });

    it('should call onChange function for "Last quarter" option with correct arguments', () => {
        render(mockCompositeCalendar());

        userEvent.click(screen.getByPlaceholderText(inputDataFromPlaceholderText));
        userEvent.click(screen.getByText(sideListLabels[4]));

        expect(mockDefaultProps.onChange).toHaveBeenCalled();
        expect(mockDefaultProps.onChange).toHaveBeenCalledWith({
            from: getDateFromNow(90),
            to: endOfTheDay,
            is_batch: true,
        });
    });

    it('should disable dates before "from" date in "to input" section ', () => {
        render(mockCompositeCalendar());
        userEvent.click(screen.getByPlaceholderText(inputDataToPlaceholderText));

        userEvent.click(screen.getByPlaceholderText(inputDataToPlaceholderText));
        expect(
            (TwoMonthPicker as unknown as jest.Mock).mock.calls[0][0].isPeriodDisabled(toMoment('1997-09-02'))
        ).toBeTruthy();
    });

    it('should disable dates after "to" date in "from input" section ', () => {
        render(mockCompositeCalendar());

        userEvent.click(screen.getByPlaceholderText(inputDataFromPlaceholderText));

        expect(
            (TwoMonthPicker as unknown as jest.Mock).mock.calls[0][0].isPeriodDisabled(toMoment('1997-09-02'))
        ).toBeFalsy();
        expect(
            (TwoMonthPicker as unknown as jest.Mock).mock.calls[0][0].isPeriodDisabled(toMoment('2024-06-06'))
        ).toBeTruthy();
    });
});
