import React from 'react';
import { Icon } from '@deriv/components';

type CalendarIconProps = {
    onClick: () => void;
};

const CalendarIcon = ({ onClick }: CalendarIconProps) => (
    <Icon onClick={onClick} icon='IcCalendarDatefrom' className='inline-icon' />
);

export default CalendarIcon;
