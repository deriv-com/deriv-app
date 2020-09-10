import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';

/**
 * Generate Calendar Icon and open
 * related calendar by clicking on it
 */
const CalendarIcon = ({ onClick }) => <Icon onClick={onClick} icon='IcCalendarDatefrom' className='inline-icon' />;

CalendarIcon.propTypes = {
    onClick: PropTypes.func, // Function that opens a calendar
};

export default CalendarIcon;
