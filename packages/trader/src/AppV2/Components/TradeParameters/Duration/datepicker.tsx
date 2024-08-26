import { ActionSheet, DatePicker, Text } from '@deriv-com/quill-ui';
import { LabelPairedCalendarLgBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import React, { useState } from 'react';
const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
};

const DurationEndTimePicker = ({
    expiry_date,
    setExpiryDate,
}: {
    setExpiryDate: (date: Date) => void;
    expiry_date: Date;
}) => {
    const [open_date_picker, setOpenDatePicker] = useState(false);
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(expiry_date);

    return (
        <div className='duration-container__date-picker'>
            <div className='duration-container__date-picker__heading'>
                <Text size='sm'>
                    <Localize i18n_default_text='Expiry' />
                </Text>
                <Text size='sm'>{formattedDate}</Text>
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
                            minDate={new Date()}
                            onChange={date => {
                                // console.log(date);
                                setExpiryDate(date);
                                setOpenDatePicker(false);
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
