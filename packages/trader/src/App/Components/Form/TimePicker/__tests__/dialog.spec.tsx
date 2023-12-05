import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dialog from '../dialog';
import moment from 'moment';

describe('<Dialog />', () => {
    const startTimes = [moment('2023-11-21T08:00:00')];
    const endTimes = [moment('2023-11-22T12:00:00')];
    const onChangeMock = jest.fn();
    const className = 'testClassName';
    const preClass = 'testPreClass';
    const selectedTime = '23:45';

    it('Should render minute and hours dialogs', () => {
        render(
            <Dialog
                className={className}
                preClass={preClass}
                selected_time={selectedTime}
                start_times={startTimes}
                end_times={endTimes}
                onChange={onChangeMock}
            />
        );
        const hourElement = screen.getByText('23');
        const minuteElement = screen.getByText('45');

        expect(screen.getByText(/hour/i)).toBeInTheDocument();
        expect(screen.getByText(/minute/i)).toBeInTheDocument();
        expect(hourElement).toBeInTheDocument();
        expect(minuteElement).toBeInTheDocument();
        expect(minuteElement).toHaveClass('testPreClass__selector-list-item--selected');
        expect(hourElement).toHaveClass('testPreClass__selector-list-item--selected');
    });
    it('Selecting disabled hour and minute does not call onChange function', () => {
        render(
            <Dialog
                className={className}
                preClass={preClass}
                selected_time={selectedTime}
                start_times={startTimes}
                end_times={endTimes}
                onChange={onChangeMock}
            />
        );
        const disabledHourElement = screen.getByText('12');
        const disabledMinuteElement = screen.getByText('45');
        userEvent.click(disabledHourElement);
        userEvent.click(disabledMinuteElement);

        expect(onChangeMock).not.toHaveBeenCalled();
    });
});
