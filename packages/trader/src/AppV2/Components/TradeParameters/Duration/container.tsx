import React, { useEffect, useMemo, useState } from 'react';
import {
    ActionSheet,
    Chip,
    DatePicker,
    Text,
    TimeWheelPickerContainer,
    WheelPickerContainer,
} from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getOptionPerUnit } from './util';
import DurationEndTimePicker from './datepicker';
import { observer } from '@deriv/stores';

const chips_options = [
    {
        name: <Localize i18n_default_text='Ticks' />,
        value: 't',
    },
    {
        name: <Localize i18n_default_text='Seconds' />,
        value: 's',
    },
    {
        name: <Localize i18n_default_text='Minutes' />,
        value: 'm',
    },
    {
        name: <Localize i18n_default_text='Hours' />,
        value: 'h',
    },
    {
        name: <Localize i18n_default_text='Days' />,
        value: 'd',
    },
    {
        name: <Localize i18n_default_text='End time' />,
        value: 'et',
    },
];

function convertToLocalTime(timeString: string) {
    const today = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    today.setHours(hours);
    today.setMinutes(minutes);
    today.setSeconds(0);

    const localHours = today.getHours().toString().padStart(2, '0');
    const localMinutes = today.getMinutes().toString().padStart(2, '0');

    return `${localHours}:${localMinutes}`;
}

function get24HourTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

const DurationActionSheetContainer = observer(
    ({ selected_hour, setSelectedHour }: { selected_hour: number[]; setSelectedHour: (arg: number[]) => void }) => {
        const { duration, duration_unit, onChangeMultiple, onChange, expiry_time, setExpiryTime } = useTraderStore();
        const [unit, setUnit] = useState(duration_unit);
        const [selected_time, setSelectedTime] = useState([duration]);
        const [expiry_date, setExpiryDate] = useState<Date>(new Date());
        const [end_time, setEndTime] = useState<string>('');

        const onChangeUnit = (value: string) => {
            if (unit !== 'h') {
                setSelectedHour([]);
            }
            setUnit(value);
        };
        const options = useMemo(() => getOptionPerUnit(unit), [unit]);

        const handleSelectExpiryDate = (date: Date) => {
            setExpiryDate(date);
            const current_date = new Date();
            const timeDifference = date - current_date;
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

        console.log('Whole Store ::::', expiry_time);

        return (
            <div className='duration-container'>
                <div className='duration-container__header'>
                    <Text bold>
                        <Localize i18n_default_text='Duration' />
                    </Text>
                </div>
                <div className='duration-container__chips'>
                    {chips_options.map((item, index) => (
                        <Chip.Selectable
                            key={index}
                            selected={unit == item.value}
                            className='duration-container__chips__chip'
                            onClick={() => onChangeUnit(item.value)}
                        >
                            <Text size='sm'>{item.name}</Text>
                        </Chip.Selectable>
                    ))}
                </div>
                <div className='duration-container__wheel-picker'>
                    {unit !== 'et' ? (
                        <WheelPickerContainer
                            data={unit == 'h' ? options : [options]}
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
                {unit == 'd' && (
                    <DurationEndTimePicker setExpiryDate={handleSelectExpiryDate} expiry_date={expiry_date} />
                )}
                {unit == 'et' && (
                    <div
                        style={{ textAlign: 'center' }}
                        onClick={() => {
                            const time = convertToLocalTime(end_time);
                            console.log('time', time);
                            onChangeMultiple({
                                expiry_time: time,
                                expiry_type: 'endtime',
                            });
                        }}
                    >
                        <Text>
                            <Localize i18n_default_text='Current time' />
                        </Text>
                        <Text>{convertToLocalTime(end_time)}</Text>
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
                                });
                            } else if (unit == 'et') {
                                setSelectedHour([]);
                                if (convertToLocalTime(end_time)) {
                                    // console.log(convertToLocalTime(end_time));
                                    const time = convertToLocalTime(end_time);
                                    onChangeMultiple({
                                        expiry_time: time,
                                        expiry_type: 'endtime',
                                    });
                                    // onChange({ target: { name: 'expiry_time', value: time } });
                                }
                            } else {
                                setSelectedHour([]);
                                onChangeMultiple({
                                    duration_unit: unit,
                                    duration: Number(selected_time),
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
