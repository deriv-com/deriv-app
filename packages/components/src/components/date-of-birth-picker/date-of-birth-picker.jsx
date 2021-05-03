import React from 'react';
import { toMoment } from '@deriv/shared';
import DatePicker from '../date-picker';

const DateOfBirthPicker = props => {
    const [max_date] = React.useState(toMoment().subtract(18, 'years'));
    const [min_date] = React.useState(toMoment().subtract(100, 'years'));
    return (
        <DatePicker
            calendar_view='year'
            display_format='DD-MM-YYYY'
            max_date={max_date}
            min_date={min_date}
            readOnly
            {...props}
        />
    );
};

export default DateOfBirthPicker;
