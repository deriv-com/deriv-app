import React from 'react';
import { toMoment } from '@deriv/shared';
import DatePicker, { type TDatePicker } from '../date-picker';

const DateOfBirthPicker = (props: TDatePicker) => {
    const [max_date] = React.useState(toMoment().subtract(18, 'years'));
    const [min_date] = React.useState(toMoment().subtract(100, 'years'));

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
