import React from 'react';
import { toMoment } from '@deriv/shared';
import DatePicker from '../date-picker';

const DateOfBirthPicker = (
    props: Omit<React.ComponentProps<typeof DatePicker>, 'display_format' | 'max_date' | 'min_date'>
) => {
    return (
        <DatePicker
            {...props}
            calendar_view='year'
            display_format='DD-MM-YYYY'
            max_date={toMoment().subtract(18, 'years')}
            min_date={toMoment().subtract(100, 'years')}
        />
    );
};

export default DateOfBirthPicker;
