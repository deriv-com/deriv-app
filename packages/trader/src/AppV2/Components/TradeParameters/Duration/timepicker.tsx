import { CaptionText, Text, TimeWheelPickerContainer } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import React from 'react';

const EndTimePicker = ({
    end_time,
    setEndTime,
    current_gmt_time,
    adjusted_start_time,
}: {
    end_time: string;
    setEndTime: (arg: string) => void;
    current_gmt_time: string;
    adjusted_start_time: string;
}) => {
    return (
        <div className='duration-container__time-picker'>
            <TimeWheelPickerContainer
                is12Hour={false}
                startTimeIn24Format={adjusted_start_time}
                minutesInterval={5}
                selectedTime={end_time}
                setSelectedValue={val => setEndTime(val as string)}
                containerHeight='256px'
                hoursInterval={1}
            />
            <div className='duration-container__endtime'>
                <CaptionText color='quill-typography__color--subtle'>
                    <Localize i18n_default_text='Current time' />
                </CaptionText>
                <Text size='sm'>{`${current_gmt_time} GMT`}</Text>
            </div>
        </div>
    );
};

export default EndTimePicker;
