import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';

const CalendarIcon = ({ onClick }) => <Icon onClick={onClick} icon='IcCalendarDatefrom' className='inline-icon' />;

CalendarIcon.propTypes = {
    onClick: PropTypes.func,
};

export default CalendarIcon;
