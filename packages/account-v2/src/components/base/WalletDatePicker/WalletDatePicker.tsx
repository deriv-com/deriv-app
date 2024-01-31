import React, { useEffect, useRef, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { useOnClickOutside } from 'usehooks-ts';
import * as Yup from 'yup';
import CalendarIcon from '../../../assets/date-picker/ic-calendar.svg';
import unixToDateString from '../utils';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import customFormatShortWeekday from './utils';
import 'react-calendar/dist/Calendar.css';
import './WalletDatePicker.scss';

interface TDatePickerProps extends WalletTextFieldProps {
    isInvalid?: WalletTextFieldProps['isInvalid'];
    maxDate?: Date;
    minDate?: Date;
    mobileAlignment?: 'above' | 'below';
    name: string;
    onDateChange: (formattedDate: string | null) => void;
    validationSchema?: Yup.AnySchema;
}

const WalletDatePicker = ({
    defaultValue,
    disabled,
    errorMessage,
    isInvalid,
    label,
    maxDate,
    message,
    minDate,
    mobileAlignment = 'below',
    name,
    onDateChange,
    ...field
}: TDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(defaultValue ? new Date(defaultValue) : null);
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const toggleCalendar = () => {
        setIsCalendarOpen(prevState => !prevState);
    };

    useOnClickOutside(datePickerRef, () => {
        setIsCalendarOpen(false);
    });

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

    return (
        <div className='wallets-datepicker' ref={datePickerRef}>
            <WalletTextField
                {...field}
                disabled={disabled}
                errorMessage={errorMessage}
                isInvalid={isInvalid}
                label={label}
                message={message}
                name={name}
                onClick={toggleCalendar}
                renderRightIcon={() => (
                    <button
                        className='wallets-datepicker__button'
                        data-testid='wallets_datepicker_button'
                        disabled={disabled}
                        onClick={toggleCalendar}
                    >
                        <CalendarIcon />
                    </button>
                )}
                showMessage
                value={selectedDate !== null ? unixToDateString(selectedDate) : ''}
            />
            {isCalendarOpen && (
                <div
                    className={`wallets-datepicker__container wallets-datepicker__container--${mobileAlignment}`}
                    data-testid='wallets_datepicker_container'
                >
                    <Calendar
                        formatShortWeekday={customFormatShortWeekday}
                        maxDate={maxDate}
                        minDate={minDate}
                        onChange={handleDateChange}
                        value={selectedDate !== null ? selectedDate : ''}
                    />
                </div>
            )}
        </div>
    );
};

export default WalletDatePicker;
