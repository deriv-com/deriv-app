import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompositeCalendarMobile from '../composite-calendar-mobile';
import { toMoment } from '@deriv/shared';

const startDate = 'Start date';
const endDate = 'End date';
const backToTodayButtonText = 'Back to today';
const radioButtonText = ['All time', 'Last 7 days', 'Last 30 days', 'Last 365 days'];
const customDateRangeText = 'Custom';
const mockDefaultProps = {
    duration_list: [
        { value: 'all_time', label: radioButtonText[0], onClick: jest.fn() },
        { value: 'last_7_days', label: radioButtonText[1], onClick: jest.fn() },
        { value: 'last_30_days', label: radioButtonText[2], onClick: jest.fn() },
        { value: 'last_365_days', label: radioButtonText[3], onClick: jest.fn() },
    ],
    from: 1696319493,
    to: 1715346191,
    onChange: jest.fn(),
    setCurrentFocus: jest.fn(),
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileDialog: jest.fn(({ children, visible, footer, onClose }) => (
        <div>
            {visible && (
                <div>
                    {children}
                    {footer}
                    <button onClick={onClose}>Close MobileDialog</button>
                </div>
            )}
        </div>
    )),
}));

describe('CompositeCalendarMobile', () => {
    const checkModalOpenCloseFunctionality = (buttonName?: string) => {
        userEvent.click(screen.getByRole('textbox'));

        radioButtonText.forEach(item => expect(screen.getByText(item)).toBeInTheDocument());
        expect(screen.getByText(customDateRangeText)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(startDate)).toBeInTheDocument();
        expect(screen.getByText(backToTodayButtonText)).toBeInTheDocument();

        if (!buttonName) return;

        userEvent.click(screen.getByText(buttonName));

        radioButtonText.forEach(item => expect(screen.queryByText(item)).not.toBeInTheDocument());
        expect(screen.queryByText(customDateRangeText)).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText(startDate)).not.toBeInTheDocument();
        expect(screen.queryByText(backToTodayButtonText)).not.toBeInTheDocument();
    };

    it('should render the input field by default and not render MobileDialog with children if the Modal is closed (default state)', () => {
        render(<CompositeCalendarMobile {...mockDefaultProps} />);

        expect(screen.getByRole('textbox')).toBeInTheDocument();
        radioButtonText.forEach(item => expect(screen.queryByText(item)).not.toBeInTheDocument());
        expect(screen.queryByText(customDateRangeText)).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText(startDate)).not.toBeInTheDocument();
        expect(screen.queryByText(backToTodayButtonText)).not.toBeInTheDocument();
    });

    it('should render functioning component if props "from" and "to" are equal to 0: MobileDialog should be opened if user clicks on the calendar field', () => {
        render(<CompositeCalendarMobile {...mockDefaultProps} from={0} to={0} />);

        radioButtonText.forEach(item => expect(screen.queryByText(item)).not.toBeInTheDocument());
        expect(screen.queryByText(customDateRangeText)).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText(startDate)).not.toBeInTheDocument();
        expect(screen.queryByText(backToTodayButtonText)).not.toBeInTheDocument();

        checkModalOpenCloseFunctionality();
    });

    it('should close the MobileDialog if user clicks on Cancel button', () => {
        render(<CompositeCalendarMobile {...mockDefaultProps} />);

        checkModalOpenCloseFunctionality('Cancel');
    });

    it('should close the MobileDialog if user clicks on Close button', () => {
        render(<CompositeCalendarMobile {...mockDefaultProps} />);

        checkModalOpenCloseFunctionality('Close MobileDialog');
    });

    it('should close the MobileDialog if user clicks on "Back to today" button', () => {
        render(<CompositeCalendarMobile {...mockDefaultProps} />);

        checkModalOpenCloseFunctionality(backToTodayButtonText);
    });

    it('should apply new value and set it to the input if user chooses some radio button value and clicks on OK button', () => {
        render(<CompositeCalendarMobile {...mockDefaultProps} />);

        const input = screen.getByRole('textbox');

        expect(input).toHaveValue(radioButtonText[0]);
        userEvent.click(input);
        userEvent.click(screen.getByText(radioButtonText[1]));

        userEvent.click(screen.getByText('OK'));
        expect(input).toHaveValue(radioButtonText[1]);
    });

    it('should apply custom value and set it to the input if user clicks on Custom radio button value and clicks on OK button', () => {
        render(<CompositeCalendarMobile {...mockDefaultProps} />);

        const input = screen.getByRole('textbox');

        expect(input).toHaveValue(radioButtonText[0]);
        userEvent.click(input);
        userEvent.click(screen.getByText(customDateRangeText));

        userEvent.click(screen.getByText('OK'));
        expect(input).toHaveValue('03 Oct 2023 - 10 May 2024');
    });

    it('should apply date which user has typed in DatePicker for Start date', () => {
        render(<CompositeCalendarMobile {...mockDefaultProps} />);

        userEvent.click(screen.getByRole('textbox'));

        const inputForStartDate = screen.getByPlaceholderText(startDate);
        expect(inputForStartDate).toHaveValue('03 Oct 2023');

        const newDate = toMoment().format('DD MMM YYYY');
        userEvent.type(inputForStartDate, newDate);
        expect(inputForStartDate).toHaveValue(newDate);
    });

    it('should apply date which user has typed in DatePicker for End date', () => {
        render(<CompositeCalendarMobile {...mockDefaultProps} />);

        userEvent.click(screen.getByRole('textbox'));

        const inputForEndDate = screen.getByPlaceholderText(endDate);
        expect(inputForEndDate).toHaveValue('10 May 2024');

        const newDate = toMoment().format('DD MMM YYYY');
        userEvent.type(inputForEndDate, newDate);
        expect(inputForEndDate).toHaveValue(newDate);
    });
});
