import { TimeWheelPickerContainer, WheelPickerContainer } from '@deriv-com/quill-ui';
import React, { useMemo } from 'react';
import { getOptionPerUnit } from './util';

const get24HourTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

const DurationWheelPicker = ({
    unit,
    setEndTime,
    setWheelPickerValue,
    selected_hour,
    selected_time,
}: {
    unit: string;
    setEndTime: (arg: string) => void;
    setWheelPickerValue: (index: number, value: string | number) => void;
    selected_hour: number[];
    selected_time: any;
}) => {
    const options = useMemo(() => getOptionPerUnit(unit), [unit]);

    return (
        <div className='duration-container__wheel-picker'>
            {unit !== 'et' ? (
                <WheelPickerContainer
                    data={unit == 'h' ? [...options] : [options]}
                    defaultValue={[String(selected_time)]}
                    inputValues={unit == 'h' ? selected_hour : selected_time}
                    setInputValues={setWheelPickerValue}
                />
            ) : (
                <TimeWheelPickerContainer
                    is12Hour={false}
                    startTimeIn24Format={get24HourTime()}
                    minutesInterval={5}
                    setSelectedValue={val => setEndTime(val as string)}
                    containerHeight='300'
                    hoursInterval={1}
                />
            )}
        </div>
    );
};

export default DurationWheelPicker;
