import React from 'react';
import { DatePicker } from '@deriv/components';
import { toMoment, convertDateFormat } from '@deriv/shared/utils/date';

class DateOfBirth extends React.Component {
    state = {
        max_date: toMoment().subtract(18, 'years'),
        min_date: toMoment().subtract(100, 'years'),
        value: this.props.value,
    };

    onChange = e => {
        if (!e.target) return;
        const value = convertDateFormat(e.target.value, 'DD-MM-YYYY', 'YYYY-MM-DD');
        this.setState({ value }, () => {
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        });
    };

    render() {
        const { id, disabled, name, label, error } = this.props;

        return (
            <DatePicker
                id={id}
                name={name}
                label={label}
                error={error}
                calendar_view='year'
                display_format='DD-MM-YYYY'
                max_date={this.state.max_date}
                min_date={this.state.min_date}
                onChange={this.onChange}
                disabled={disabled}
                value={this.state.value}
            />
        );
    }
}

export default DateOfBirth;
