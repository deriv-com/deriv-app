import React, { useEffect, useMemo, useState } from 'react';
import { ActionSheet, CaptionText, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import DurationEndTimePicker from './datepicker';
import { observer, useStore } from '@deriv/stores';
import { setTime, toMoment } from '@deriv/shared';
import { getSelectedTime } from 'Stores/Modules/Trading/Helpers/end-time';
import DurationChips from './chips';
import DurationWheelPicker from './wheelpicker';

const DurationActionSheetContainer = observer(
    ({ selected_hour, setSelectedHour }: { selected_hour: number[]; setSelectedHour: (arg: number[]) => void }) => {
        const {
            duration,
            duration_unit,
            duration_units_list,
            onChangeMultiple,
            expiry_date,
            market_close_times,
            market_open_times,
        } = useTraderStore();

        const [unit, setUnit] = useState(duration_unit);
        const [selected_time, setSelectedTime] = useState([duration]);
        const [expiry_date_data, setExpiryDate] = useState<Date>(new Date());
        const [end_time, setEndTime] = useState<string>('');

        const { common } = useStore();
        const { server_time } = common;
        const moment_expiry_date = toMoment(expiry_date);
        const market_open_datetimes = market_open_times.map(open_time =>
            setTime(moment_expiry_date.clone(), open_time)
        );
        const expiry_datetime = setTime(moment_expiry_date.clone(), end_time);
        const market_close_datetimes = market_close_times.map(close_time =>
            setTime(moment_expiry_date.clone(), close_time)
        );
        const server_datetime = toMoment(server_time);

        const time = getSelectedTime(
            server_datetime.clone(),
            expiry_datetime,
            market_open_datetimes,
            market_close_datetimes
        );

        const onChangeUnit = (value: string) => {
            if (unit !== 'h') {
                setSelectedHour([]);
            }
            setUnit(value);
        };

        const handleSelectExpiryDate = (date: Date) => {
            setExpiryDate(date);
            const current_date = new Date();
            const timeDifference = +date - +current_date;
            const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            setSelectedTime([dayDifference]);
        };

        useEffect(() => {
            if (duration_unit === 'm' && duration > 59) {
                const hour = Math.floor(duration / 60);
                const minutes = duration % 60;
                setSelectedHour([hour, minutes]);
                setUnit('h');
            }
        }, [duration, duration_unit, setSelectedHour]);

        const setWheelPickerValue = (index: number, value: string | number) => {
            if (unit === 'h') {
                const arr = selected_hour;
                arr[index] = Number(value);
                setSelectedHour(arr);
            } else if (unit == 'd') {
                setSelectedTime([Number(value)]);
                const updated_date = new Date();
                updated_date.setDate(updated_date.getDate() + Number(value));
                setExpiryDate(updated_date);
            } else {
                setSelectedTime([Number(value)]);
            }
        };

        return (
            <div className='duration-container'>
                <div className='duration-container__header'>
                    <Text bold>
                        <Localize i18n_default_text='Duration' />
                    </Text>
                </div>
                <DurationChips duration_units_list={duration_units_list} onChangeUnit={onChangeUnit} unit={unit} />
                <DurationWheelPicker
                    unit={unit}
                    setEndTime={setEndTime}
                    setWheelPickerValue={setWheelPickerValue}
                    selected_hour={selected_hour}
                    selected_time={selected_time}
                />
                {unit == 'd' && (
                    <DurationEndTimePicker setExpiryDate={handleSelectExpiryDate} expiry_date={expiry_date_data} />
                )}
                {unit == 'et' && (
                    <div style={{ textAlign: 'center' }}>
                        <CaptionText>
                            <Localize i18n_default_text='Current time' />
                        </CaptionText>
                        <Text>{`${time} GMT`}</Text>
                    </div>
                )}
                <ActionSheet.Footer
                    alignment='vertical'
                    primaryAction={{
                        content: <Localize i18n_default_text='Save' />,
                        onAction: () => {
                            if (unit == 'h') {
                                const minutes = selected_hour[0] * 60 + selected_hour[1];
                                onChangeMultiple({
                                    duration_unit: 'm',
                                    duration: Number(minutes),
                                    expiry_time: null,
                                    expiry_type: 'duration',
                                });
                            } else if (unit == 'et') {
                                setSelectedHour([]);
                                onChangeMultiple({
                                    expiry_time: end_time,
                                    expiry_type: 'endtime',
                                });
                            } else {
                                setSelectedHour([]);
                                onChangeMultiple({
                                    duration_unit: unit,
                                    duration: Number(selected_time),
                                    expiry_time: null,
                                    expiry_type: 'duration',
                                });
                            }
                        },
                    }}
                />
            </div>
        );
    }
);

export default DurationActionSheetContainer;
