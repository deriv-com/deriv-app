import React, { useEffect, useRef, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { useOnClickOutside } from 'usehooks-ts';
import { Input } from '@deriv-com/ui';
import CalendarIcon from '../../../assets/date-picker/ic-calendar.svg';
import unixToDateString from '../utils';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import customFormatShortWeekday from './utils';
import 'react-calendar/dist/Calendar.css';
import './WalletDatePicker.scss';

interface TDatePickerProps extends WalletTextFieldProps {
    isInvalid?: WalletTextFieldProps['isInvalid'];
    maxDate?: Date;
    minDate?: Date;
    mobileAlignment?: 'above' | 'below';
    onDateChange: (formattedDate: string | null) => void;
}

// TODO: Move this component to @deriv-com/ui
const WalletDatePicker = ({
    defaultValue,
    disabled,
    errorMessage,
    isInvalid,
    label,
    maxDate,
    minDate,
    mobileAlignment = 'below',
    onBlur,
    onChange,
    onDateChange,
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
        setSelectedDate(new Date(calendarSelectedDate?.toString() ?? ''));
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
            <Input
                aria-label={label}
                autoComplete='off'
                className='w-full'
                error={isInvalid}
                label={label}
                message={isInvalid ? errorMessage?.toString() : ''}
                onBlur={onBlur}
                onChange={onChange}
                onClick={toggleCalendar}
                rightPlaceholder={
                    <button
                        className='wallets-datepicker__button'
                        data-testid='wallets_datepicker_button'
                        disabled={disabled}
                        onClick={toggleCalendar}
                        type='button'
                    >
                        <CalendarIcon />
                    </button>
                }
                value={selectedDate ? unixToDateString(selectedDate) : ''}
                wrapperClassName='w-full'
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
                        value={selectedDate ?? ''}
                    />
                </div>
            )}
        </div>
    );
};

export default WalletDatePicker;
