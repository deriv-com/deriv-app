import React from 'react';
import { Icon } from '@deriv/components';

type TCalendarIcon = {
    onClick: () => void;
};

const CalendarIcon = ({ onClick }: TCalendarIcon) => (
    <Icon onClick={onClick} icon='IcCalendarDatefrom' className='inline-icon' />
);

export default CalendarIcon;
