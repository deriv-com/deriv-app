import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Calendar, { CalendarProps } from 'react-calendar';
import CalendarIcon from '../../public/images/ic-calendar.svg';
import FlowTextField, { TFlowFieldProps } from '../FlowField/FlowTextField';
import unixToDateString, { customFormatShortWeekday } from './utils';
import 'react-calendar/dist/Calendar.css';
import './DatePicker.scss';

interface TDatePickerProps extends TFlowFieldProps {
    mobileAlignment?: 'above' | 'below';
    onDateChange: (formattedDate: string | null) => void;
    variant?: 'dateOfBirth' | 'expiry';
}

const DatePicker = ({
    defaultValue,
    label,
    message,
    mobileAlignment = 'below',
    name,
    onDateChange,
    validationSchema,
    variant = 'dateOfBirth',
}: TDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(defaultValue ? new Date(defaultValue) : null);
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const maxDate = variant === 'expiry' ? undefined : moment().subtract(18, 'years').toDate();
    const minDate = variant === 'expiry' ? moment().add(2, 'days').toDate() : moment().subtract(100, 'years').toDate();

    const toggleCalendar = () => {
        setIsCalendarOpen(prevState => !prevState);
    };

    const handleDateChange: CalendarProps['onChange'] = value => {
        const calendarSelectedDate = Array.isArray(value) ? value[0] : value;
        setSelectedDate(calendarSelectedDate);
        setIsCalendarOpen(false);
    };

    useEffect(() => {
        if (selectedDate !== null) {
            onDateChange(unixToDateString(selectedDate));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (isCalendarOpen && datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isCalendarOpen]);

    return (
        <div className='wallets-datepicker' ref={datePickerRef}>
            <FlowTextField
                label={label}
                message={message}
                name={name}
                onClick={toggleCalendar}
                renderRightIcon={() => (
                    <button
                        className='wallets-datepicker__button'
                        data-testid='wallets_datepicker_button'
                        onClick={toggleCalendar}
                    >
                        <CalendarIcon />
                    </button>
                )}
                showMessage
                type='date'
                validationSchema={validationSchema}
                value={selectedDate !== null ? unixToDateString(selectedDate) : ''}
            />
            {isCalendarOpen && (
                <div
                    className={classNames('wallets-datepicker__container', {
                        'wallets-datepicker__container--above': mobileAlignment === 'above',
                        'wallets-datepicker__container--below': mobileAlignment === 'below',
                    })}
                    data-testid='wallets_datepicker_container'
                >
                    <Calendar
                        formatShortWeekday={customFormatShortWeekday}
                        maxDate={maxDate}
                        minDate={minDate}
                        onChange={handleDateChange}
                        value={selectedDate !== null ? unixToDateString(selectedDate) : ''}
                    />
                </div>
            )}
        </div>
    );
};

export default DatePicker;
