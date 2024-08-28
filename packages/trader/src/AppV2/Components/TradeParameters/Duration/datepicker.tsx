import { ActionSheet, CaptionText, DatePicker, Text } from '@deriv-com/quill-ui';
import { LabelPairedCalendarLgBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import React, { useState } from 'react';

const formatDate = (date: Date) => {
    const utcYear = date.getFullYear();
    const utcMonth = date.getMonth();
    const utcDay = date.getDate();

    const utcDate = new Date(Date.UTC(utcYear, utcMonth, utcDay, 23, 59, 59));
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(utcDate);
    return `${formattedDate} GMT`;
};

const calculateTotalDays = (expiryDate: Date) => {
    const today = new Date();
    const timeDifference = expiryDate.getTime() - today.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return dayDifference;
};

const DurationEndTimePicker = ({
    expiry_date,
    setExpiryDate,
    setSelectedTime,
}: {
    setExpiryDate: (date: Date) => void;
    expiry_date: Date;
    setSelectedTime: (arg: number[]) => void;
}) => {
    const [open_date_picker, setOpenDatePicker] = useState(false);

    return (
        <div className='duration-container__date-picker'>
            <div className='duration-container__date-picker__heading'>
                <CaptionText color='quill-typography__color--subtle'>
                    <Localize i18n_default_text='Expiry' />
                </CaptionText>
                <Text size='sm'>{formatDate(expiry_date)}</Text>
            </div>
            <div>
                <LabelPairedCalendarLgBoldIcon
                    className='duration-container__date-picker__icon'
                    onClick={() => setOpenDatePicker(true)}
                />
                <ActionSheet.Root
                    isOpen={open_date_picker}
                    onClose={() => setOpenDatePicker(false)}
                    position='left'
                    expandable={false}
                >
                    <ActionSheet.Portal shouldCloseOnDrag>
                        <ActionSheet.Header title={<Localize i18n_default_text='Pick an end date' />} />
                        <DatePicker
                            hasFixedWidth={false}
                            minDate={new Date()}
                            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                            onChange={date => {
                                if (date && date instanceof Date) {
                                    setExpiryDate(date);
                                    setSelectedTime([calculateTotalDays(date)]);
                                    setOpenDatePicker(false);
                                }
                            }}
                            wrapperClassName='duration-container__date-picker__sheet'
                        />
                    </ActionSheet.Portal>
                </ActionSheet.Root>
            </div>
        </div>
    );
};

export default DurationEndTimePicker;
