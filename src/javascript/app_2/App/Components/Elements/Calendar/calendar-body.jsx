import PropTypes      from 'prop-types';
import React          from 'react';
import {
    CalendarDays,
    CalendarMonths,
    CalendarYears,
    CalendarDecades } from './panels';

const CalendarBody = (props) => {
    const calendar_body = {
        date  : <CalendarDays    {...props} />,
        month : <CalendarMonths  {...props} />,
        year  : <CalendarYears   {...props} />,
        decade: <CalendarDecades {...props} />,
    };

    return (
        <React.Fragment>
            { calendar_body[props.calendar_view] }
        </React.Fragment>
    );
};

CalendarBody.propTypes = {
    calendar_view: PropTypes.string,
};

export default CalendarBody;
