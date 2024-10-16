import { WheelPickerContainer } from '@deriv-com/quill-ui';
import { localize } from '@deriv/translations';
import React, { useState, useEffect } from 'react';

type TimeOption = {
    label: string;
    value: number;
};

const HourPicker = ({
    setWheelPickerValue,
    selected_hour,
    selected_time,
    duration_min_max,
}: {
    setWheelPickerValue: (index: number, value: string | number) => void;
    selected_hour: number[];
    selected_time: number[];
    duration_min_max: Record<string, { min: number; max: number }>;
}) => {
    const [hours, setHours] = useState<TimeOption[]>([]);
    const [minutes, setMinutes] = useState<TimeOption[]>([]);

    useEffect(() => {
        const min_seconds = Math.max(duration_min_max.intraday.min, 3600);
        const max_seconds = duration_min_max.intraday.max;

        const min_hours = Math.max(1, Math.ceil(min_seconds / 3600));
        const max_hours = Math.floor(max_seconds / 3600);

        const new_hours = Array.from({ length: max_hours - min_hours + 1 }, (_, i) => ({
            label: `${i + min_hours} ${localize('h')}`,
            value: i + min_hours,
        }));
        setHours(new_hours);

        update_minutes(selected_hour[0] || min_hours, min_seconds, max_seconds);
    }, [duration_min_max, selected_hour]);

    const update_minutes = (selected_hour: number, min_seconds: number, max_seconds: number) => {
        let min_minutes = 0;
        let max_minutes = 59;

        if (selected_hour === Math.ceil(min_seconds / 3600)) {
            min_minutes = Math.ceil((min_seconds % 3600) / 60);
        }

        if (selected_hour === Math.floor(max_seconds / 3600)) {
            max_minutes = Math.floor((max_seconds % 3600) / 60);
        }

        if (min_minutes > 0 && selected_hour * 3600 >= min_seconds) {
            min_minutes = 0;
        }

        const new_minutes = Array.from({ length: max_minutes - min_minutes + 1 }, (_, i) => ({
            label: `${i + min_minutes} ${localize('mins')}`,
            value: i + min_minutes,
        }));
        setMinutes(new_minutes);
    };

    const handle_value_change = (index: number, value: string | number) => {
        setWheelPickerValue(index, value);
        if (index === 0) {
            update_minutes(Number(value), duration_min_max.intraday.min, duration_min_max.intraday.max);
        }
    };

    const getDefaultValue = (options: TimeOption[], selected_value: number) => {
        const option = options.find(opt => opt.value === selected_value);
        return option ? option.label : options[0]?.label || `1 ${localize('h')}`;
    };

    return (
        <WheelPickerContainer
            data={[hours, minutes]}
            defaultValue={[getDefaultValue(hours, selected_hour[0]), getDefaultValue(minutes, selected_time[1])]}
            containerHeight='268px'
            inputValues={[selected_hour[0] || hours[0]?.value, selected_time[1] || minutes[0]?.value]}
            setInputValues={handle_value_change}
        />
    );
};

export default HourPicker;
