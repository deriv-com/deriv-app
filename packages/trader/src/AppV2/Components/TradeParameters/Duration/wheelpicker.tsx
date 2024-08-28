import { TimeWheelPickerContainer, WheelPickerContainer } from '@deriv-com/quill-ui';
import { getOptionPerUnit } from './util';
import React from 'react';

const formatCurrentGMTDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(now);
    return formattedDate;
};

const DurationWheelPicker = ({
    unit,
    setEndTime,
    setWheelPickerValue,
    selected_hour,
    selected_time,
    toggle_picker,
}: {
    unit: string;
    setEndTime: (arg: string) => void;
    setWheelPickerValue: (index: number, value: string | number) => void;
    selected_hour: number[];
    selected_time: any;
    toggle_picker: boolean;
}) => {
    const options = React.useMemo(() => getOptionPerUnit(unit), [unit]);
    return (
        <>
            {unit !== 'et' ? (
                <WheelPickerContainer
                    key={`${unit}-${toggle_picker}`}
                    data={options}
                    defaultValue={[String(selected_time)]}
                    containerHeight={unit == 'd' ? '224px' : '268px'}
                    inputValues={unit == 'h' ? selected_hour : selected_time}
                    setInputValues={setWheelPickerValue}
                />
            ) : (
                <TimeWheelPickerContainer
                    key={unit}
                    is12Hour={false}
                    startTimeIn24Format={formatCurrentGMTDate()}
                    minutesInterval={5}
                    setSelectedValue={val => setEndTime(val as string)}
                    containerHeight='224px'
                    hoursInterval={1}
                />
            )}
        </>
    );
};

export default DurationWheelPicker;
