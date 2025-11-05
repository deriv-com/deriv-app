import React, { useState } from 'react';
import { ActionSheet } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer } from '@deriv/stores';
import DurationChips from './chips';
import DurationWheelPicker from './duration-wheel-picker';
import DayInput from './day';
import { DURATION_UNIT } from 'AppV2/Utils/trade-params-utils';

const DurationActionSheetContainer = observer(
    ({
        end_time,
        expiry_time_string,
        saved_expiry_date_v2,
        selected_hour,
        setEndTime,
        setExpiryTimeString,
        setSavedExpiryDateV2,
        setSelectedHour,
        setUnit,
        setUnsavedExpiryDateV2,
        unit,
        unsaved_expiry_date_v2,
    }: {
        selected_hour: number[];
        setSelectedHour: (arg: number[]) => void;
        unit: string;
        setUnit: (arg: string) => void;
        end_time: string;
        setEndTime: (arg: string) => void;
        expiry_time_string: string;
        setExpiryTimeString: (arg: string) => void;
        saved_expiry_date_v2: string;
        setSavedExpiryDateV2: (arg: string) => void;
        unsaved_expiry_date_v2: string;
        setUnsavedExpiryDateV2: (arg: string) => void;
    }) => {
        const { duration, duration_units_list, onChangeMultiple } = useTraderStore();
        const [selected_time, setSelectedTime] = useState([duration]);
        const [expiry_time_input, setExpiryTimeInput] = React.useState(expiry_time_string);

        React.useEffect(() => {
            setUnsavedExpiryDateV2(saved_expiry_date_v2 || unsaved_expiry_date_v2);
        }, []);

        const onAction = () => {
            setExpiryTimeString(expiry_time_input);
            setSavedExpiryDateV2(unsaved_expiry_date_v2);
            if (unit === DURATION_UNIT.HOURS) {
                const minutes = selected_hour[0] * 60 + selected_hour[1];
                const hour = Math.floor(duration / 60);
                const min = duration % 60;
                setSelectedHour([hour, min]);
                setEndTime('');
                onChangeMultiple({
                    duration_unit: DURATION_UNIT.MINUTES,
                    duration: Number(minutes),
                    expiry_type: 'duration',
                    // Clear endtime fields when using duration mode
                    expiry_time: null,
                    expiry_date: null,
                });
            } else if (unit === DURATION_UNIT.DAYS) {
                setSelectedHour([]);
                // When Days unit is selected, it represents End Time mode
                const time_to_use = end_time || expiry_time_string || '23:59:59';
                onChangeMultiple({
                    expiry_date: unsaved_expiry_date_v2,
                    expiry_time: time_to_use,
                    expiry_type: 'endtime',
                });
            } else {
                setEndTime('');
                setSelectedHour([]);
                onChangeMultiple({
                    duration_unit: unit,
                    duration: Number(selected_time),
                    expiry_type: 'duration',
                    // Clear endtime fields when using duration mode
                    expiry_time: null,
                    expiry_date: null,
                });
            }
        };

        const onChangeUnit = React.useCallback(
            (value: string) => {
                setUnit(value);
                setSelectedTime([]);
                if (value !== DURATION_UNIT.HOURS) {
                    setSelectedHour([]);
                }
            },
            [setUnit, setSelectedHour]
        );

        const setWheelPickerValue = (index: number, value: string | number) => {
            const num_value = Number(value);
            if (unit === DURATION_UNIT.HOURS) {
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
                {unit !== DURATION_UNIT.DAYS && (
                    <DurationWheelPicker
                        unit={unit}
                        setWheelPickerValue={setWheelPickerValue}
                        selected_hour={selected_hour}
                        selected_time={selected_time}
                    />
                )}

                {unit === DURATION_UNIT.DAYS && (
                    <DayInput
                        end_time={end_time}
                        expiry_time_input={expiry_time_input}
                        saved_expiry_date_v2={saved_expiry_date_v2}
                        setEndTime={setEndTime}
                        setExpiryTimeInput={setExpiryTimeInput}
                        setUnsavedExpiryDateV2={setUnsavedExpiryDateV2}
                        unsaved_expiry_date_v2={unsaved_expiry_date_v2 || saved_expiry_date_v2}
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
