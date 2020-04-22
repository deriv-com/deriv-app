import PropTypes from 'prop-types';
import React from 'react';
import Views from './views';

const Body = props => {
    const calendar_body = {
        date: <Views.Days {...props} />,
        month: <Views.Months {...props} />,
        year: <Views.Years {...props} />,
        decade: <Views.Decades {...props} />,
    };

    return <>{calendar_body[props.calendar_view]}</>;
};

Body.propTypes = {
    calendar_view: PropTypes.string,
};

export default Body;
