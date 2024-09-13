import { ActionSheet, Button, CaptionText, DatePicker, Text } from '@deriv-com/quill-ui';
import { LabelPairedCalendarSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import React, { useState } from 'react';

const formatDate = (date: Date) => {
    const utc_year = date.getFullYear();
    const utc_month = date.getMonth();
    const utc_day = date.getDate();

    const utc_date = new Date(Date.UTC(utc_year, utc_month, utc_day, 23, 59, 59));
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
    const formatted_date = new Intl.DateTimeFormat('en-GB', options).format(utc_date);
    return `${formatted_date} GMT`;
};

const calculateTotalDays = (expiry_date: Date) => {
    const today = new Date();
    const time_difference = expiry_date.getTime() - today.getTime();
    const day_difference = Math.ceil(time_difference / (1000 * 60 * 60 * 24));
    return day_difference;
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
                <Button
                    variant='secondary'
                    size='md'
                    color='black-white'
                    onClick={() => setOpenDatePicker(true)}
                    icon={<LabelPairedCalendarSmBoldIcon />}
                    iconButton
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
