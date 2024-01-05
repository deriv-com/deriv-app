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
        const hour_element = screen.getByText('23');
        const minute_element = screen.getByText('45');

        expect(screen.getByText(/hour/i)).toBeInTheDocument();
        expect(screen.getByText(/minute/i)).toBeInTheDocument();
        expect(hour_element).toBeInTheDocument();
        expect(minute_element).toBeInTheDocument();
        expect(minute_element).toHaveClass('testPreClass__selector-list-item--selected');
        expect(hour_element).toHaveClass('testPreClass__selector-list-item--selected');
    });
    it('Selecting disabled hour and minute does not call onChange function', () => {
        render(<Dialog {...default_props} />);
        const disabled_hour_element = screen.getByText('12');
        const disabled_minute_element = screen.getByText('45');
        userEvent.click(disabled_hour_element);
        userEvent.click(disabled_minute_element);

        expect(default_props.onChange).not.toHaveBeenCalled();
    });
});
