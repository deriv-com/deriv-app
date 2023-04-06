import React from 'react';
import { toMoment } from '@deriv/shared';
import DatePicker from '../date-picker';

const DateOfBirthPicker = (props: Omit<React.ComponentProps<typeof DatePicker>, 'display_format' | 'max_date' | 'min_date'>) => {
    const max_date = toMoment().subtract(18, 'years');
    const min_date = toMoment().subtract(100, 'years');

    return (
        <DatePicker
            {...props}
            calendar_view='year'
            display_format='DD-MM-YYYY'
            max_date={max_date}
            min_date={min_date}
        />
    );
};

export default DateOfBirthPicker;
