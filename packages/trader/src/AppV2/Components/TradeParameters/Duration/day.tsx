import { ActionSheet, Text, TextField } from '@deriv-com/quill-ui';
import { LabelPairedCalendarSmRegularIcon, LabelPairedClockThreeSmRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import React, { useEffect } from 'react';

import DaysDatepicker from './datepicker';
import EndTimePicker from './timepicker';

const DayInput = ({
    setEndTime,
    setEndDate,
    end_date,
    end_time,
}: {
    setEndTime: (arg: string) => void;
    setEndDate: (arg: Date) => void;
    end_date: Date;
    end_time: string;
}) => {
    const [open, setOpen] = React.useState(false);
    const [open_timepicker, setOpenTimePicker] = React.useState(false);

    const formatted_date = end_date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    const formatted_current_date = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    useEffect(() => {
        if (formatted_date === formatted_current_date && !end_time) {
            // the last time of the timepicker
            setEndTime('23:55');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [end_date]);

    return (
        <div className='duration-container__days-input'>
            <TextField
                variant='fill'
                readOnly
                textAlignment='center'
                value={formatted_date}
                onClick={() => {
                    setOpen(true);
                }}
                leftIcon={<LabelPairedCalendarSmRegularIcon width={24} height={24} />}
            />

            <TextField
                variant='fill'
                readOnly
                textAlignment='center'
                value={formatted_date !== formatted_current_date || !end_time ? '12:59:59 GMT' : end_time}
                disabled={formatted_date !== formatted_current_date}
                onClick={() => {
                    setOpenTimePicker(true);
                }}
                leftIcon={<LabelPairedClockThreeSmRegularIcon width={24} height={24} />}
            />

            <div className='duration-container__days-input__expiry'>
                <Text size='sm' color='quill-typography__color--subtle'>
                    <Localize i18n_default_text='Expiry' />
                </Text>
                <Text size='sm'>{`${formatted_date} ${end_time || '12:59:59'} GMT`}</Text>
            </div>
            <ActionSheet.Root
                isOpen={open || open_timepicker}
                onClose={() => {
                    setOpen(false);
                    setOpenTimePicker(false);
                }}
                position='left'
                expandable={false}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header
                        title={
                            open ? (
                                <Localize i18n_default_text='Pick an end date' />
                            ) : (
                                <Localize i18n_default_text='Pick an end time' />
                            )
                        }
                    />
                    {open && <DaysDatepicker end_date={end_date} setEndDate={setEndDate} />}
                    {open_timepicker && <EndTimePicker setEndTime={setEndTime} end_time={end_time} />}
                    <ActionSheet.Footer
                        alignment='vertical'
                        shouldCloseOnPrimaryButtonClick={false}
                        primaryAction={{
                            content: <Localize i18n_default_text='Done' />,
                            onAction: () => {
                                setOpen(false);
                                setOpenTimePicker(false);
                                if (formatted_date !== formatted_current_date) {
                                    setEndTime('');
                                }
                            },
                        }}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </div>
    );
};

export default DayInput;
