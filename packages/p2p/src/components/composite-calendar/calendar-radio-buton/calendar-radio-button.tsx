import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';

type TCalendarRadioButtonProps = {
    id: string;
    className?: string;
    selected_value?: string;
    value: string;
    label: string;
    onChange: (value: { label?: string; value?: string }) => void;
};

const CalendarRadioButton = ({ id, className, selected_value, value, label, onChange }: TCalendarRadioButtonProps) => {
    return (
        <label
            htmlFor={id}
            className={classNames('calendar-radio-button', className, {
                'calendar-radio-button--selected': selected_value === value,
            })}
            onClick={() => onChange({ label, value })}
        >
            <input className='calendar-radio-button__input' id={id} type='radio' value={value} />
            <span
                className={classNames('calendar-radio-button__circle', {
                    'calendar-radio-button__circle--selected': selected_value === value,
                })}
            />
            <Text
                as='p'
                color='prominent'
                size='xs'
                line_height='unset'
                weight={selected_value === value ? 'bold' : 'normal'}
            >
                {label}
            </Text>
        </label>
    );
};

export default CalendarRadioButton;
