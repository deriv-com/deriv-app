import React from 'react';
import { toMoment } from '@deriv/shared';
import DatePicker from '../date-picker';

class DateOfBirthPicker extends React.Component {
    state = {
        max_date: toMoment().subtract(18, 'years'),
        min_date: toMoment().subtract(100, 'years'),
        value: this.props.value,
    };

    render() {
        const { min_date, max_date, value, ...props } = this.props;

        return (
            <DatePicker
                calendar_view='year'
                display_format='DD-MM-YYYY'
                max_date={this.state.max_date}
                min_date={this.state.min_date}
                value={this.state.value}
                readOnly
                {...props}
            />
        );
    }
}

export default DateOfBirthPicker;
