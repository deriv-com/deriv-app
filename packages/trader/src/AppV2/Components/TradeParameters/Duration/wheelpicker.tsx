import { TimeWheelPickerContainer, WheelPickerContainer } from '@deriv-com/quill-ui';
import { getOptionPerUnit } from 'AppV2/Utils/trade-params-utils';
import clsx from 'clsx';
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
}: {
    unit: string;
    setEndTime: (arg: string) => void;
    setWheelPickerValue: (index: number, value: string | number) => void;
    selected_hour: number[];
    selected_time: number[];
}) => {
    const options = React.useMemo(() => getOptionPerUnit(unit), [unit]);

    return (
        <div
            className={clsx('duration-container__wheel-picker-container', {
                'duration-container__wheel-picker-container__day': ['d', 'et'].includes(unit),
            })}
        >
            {unit !== 'et' ? (
                <WheelPickerContainer
                    {...(unit === 'd' ? { key: unit } : {})}
                    data={options}
                    defaultValue={[String(selected_time)]}
                    containerHeight={unit == 'd' ? '228px' : '268px'}
                    inputValues={unit == 'h' ? selected_hour : selected_time}
                    setInputValues={setWheelPickerValue}
                />
            ) : (
                <TimeWheelPickerContainer
                    is12Hour={false}
                    startTimeIn24Format={formatCurrentGMTDate()}
                    minutesInterval={5}
                    setSelectedValue={val => setEndTime(val as string)}
                    containerHeight='226px'
                    hoursInterval={1}
                />
            )}
        </div>
    );
};

export default DurationWheelPicker;
