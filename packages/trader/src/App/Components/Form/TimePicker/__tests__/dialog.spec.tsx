import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dialog from '../dialog';
import moment from 'moment';

describe('<Dialog />', () => {
    const default_props = {
        start_times: [moment('2023-11-21T08:00:00')],
        end_times: [moment('2023-11-22T12:00:00')],
        onChange: jest.fn(),
        className: 'testClassName',
        preClass: 'testPreClass',
        selected_time: '23:45',
    };

    it('Should render minute and hours dialogs', () => {
        render(<Dialog {...default_props} />);
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
        render(<Dialog {...default_props} />);
        const disabledHourElement = screen.getByText('12');
        const disabledMinuteElement = screen.getByText('45');
        userEvent.click(disabledHourElement);
        userEvent.click(disabledMinuteElement);

        expect(default_props.onChange).not.toHaveBeenCalled();
    });
});
