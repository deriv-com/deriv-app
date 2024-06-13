import React from 'react';
import { Icon } from '@deriv/components';

type TCalendarIcon = {
    onClick: () => void;
};

const CalendarIcon = ({ onClick }: TCalendarIcon) => (
    <Icon onClick={onClick} icon='IcCalendarDatefrom' className='inline-icon' data_testid='dt_calendar_icon' />
);

export default CalendarIcon;
