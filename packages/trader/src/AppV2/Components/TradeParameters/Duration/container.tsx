import React, { useState } from 'react';
import { ActionSheet } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer } from '@deriv/stores';
import DurationChips from './chips';
import DurationWheelPicker from './wheelpicker';
import DayInput from './day';

const DurationActionSheetContainer = observer(
    ({
        selected_hour,
        setSelectedHour,
        unit,
        end_date,
        setEndDate,
        setUnit,
        end_time,
        setEndTime,
        expiry_time_string,
        setExpiryTimeString,
    }: {
        selected_hour: number[];
        setSelectedHour: (arg: number[]) => void;
        unit: string;
        end_date: Date;
        setEndDate: (arg: Date) => void;
        setUnit: (arg: string) => void;
        end_time: string;
        setEndTime: (arg: string) => void;
        expiry_time_string: string;
        setExpiryTimeString: (arg: string) => void;
    }) => {
        const { duration, duration_units_list, onChangeMultiple } = useTraderStore();
        const [selected_time, setSelectedTime] = useState([duration]);
        const [temp_expiry_time, setTempExpiryTime] = React.useState(expiry_time_string);

        const onAction = () => {
            setExpiryTimeString(temp_expiry_time);
            if (unit === 'h') {
                const minutes = selected_hour[0] * 60 + selected_hour[1];
                const hour = Math.floor(duration / 60);
                const min = duration % 60;
                setSelectedHour([hour, min]);
                setEndTime('');
                onChangeMultiple({
                    duration_unit: 'm',
                    duration: Number(minutes),
                    expiry_time: null,
                    expiry_type: 'duration',
                });
            } else if (unit === 'd') {
                const difference_in_time = end_date.getTime() - new Date().getTime();
                const difference_in_days = Math.ceil(difference_in_time / (1000 * 3600 * 24));
                setSelectedHour([]);
                if (end_time) {
                    onChangeMultiple({
                        expiry_time: end_time,
                        expiry_type: 'endtime',
                    });
                } else {
                    setEndTime('');
                    onChangeMultiple({
                        duration_unit: 'd',
                        duration: Number(difference_in_days),
                        expiry_time: null,
                        expiry_type: 'duration',
                    });
                }
            } else {
                setEndTime('');
                setSelectedHour([]);
                onChangeMultiple({
                    duration_unit: unit,
                    duration: Number(selected_time),
                    expiry_time: null,
                    expiry_type: 'duration',
                });
            }
        };

        const onChangeUnit = React.useCallback(
            (value: string) => {
                setUnit(value);
                setSelectedTime([]);
                if (value !== 'h') {
                    setSelectedHour([]);
                }
            },
            [setUnit, setSelectedHour]
        );

        const setWheelPickerValue = (index: number, value: string | number) => {
            const num_value = Number(value);
            if (unit === 'h') {
                const arr = selected_hour;
                arr[index] = num_value;
                setSelectedHour(arr);
            } else {
                setSelectedTime([num_value]);
            }
        };

        return (
            <div className='duration-container'>
                <ActionSheet.Header title={<Localize i18n_default_text='Duration' />} />
                <DurationChips duration_units_list={duration_units_list} onChangeUnit={onChangeUnit} unit={unit} />
                {unit !== 'd' && (
                    <DurationWheelPicker
                        unit={unit}
                        setWheelPickerValue={setWheelPickerValue}
                        selected_hour={selected_hour}
                        selected_time={selected_time}
                    />
                )}

                {unit === 'd' && (
                    <DayInput
                        setEndTime={setEndTime}
                        setEndDate={setEndDate}
                        end_date={end_date}
                        end_time={end_time}
                        setTempExpiryTime={setTempExpiryTime}
                        temp_expiry_time={temp_expiry_time}
                    />
                )}
                <ActionSheet.Footer
                    alignment='vertical'
                    primaryAction={{
                        content: <Localize i18n_default_text='Save' />,
                        onAction,
                    }}
                />
            </div>
        );
    }
);

export default DurationActionSheetContainer;
