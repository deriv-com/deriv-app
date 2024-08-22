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
import { LabelPairedCalendarLgBoldIcon } from '@deriv/quill-icons';
import DurationEndTimePicker from './datepicker';

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

const DurationActionSheetContainer = ({
    selected_hour,
    setSelectedHour,
}: {
    selected_hour: number[];
    setSelectedHour: (arg: number[]) => void;
}) => {
    const { duration, duration_unit, onChangeMultiple } = useTraderStore();
    const [unit, setUnit] = useState(duration_unit);
    const [selected_time, setSelectedTime] = useState([duration]);
    const [expiry_date, setExpiryDate] = useState<Date>(new Date());
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [selected_end_time, setSelectedEndTime] = useState('');
    const onChangeUnit = (value: string) => {
        if (unit !== 'h') {
            setSelectedHour([]);
        }
        setUnit(value);
    };
    const options = useMemo(() => getOptionPerUnit(unit), [unit]);

    useEffect(() => {
        if (duration_unit === 'm' && duration > 59) {
            const hour = Math.floor(duration / 60);
            const minutes = duration % 60;
            setSelectedHour([hour, minutes]);
            setUnit('h');
        }
    }, [duration, duration_unit, setSelectedHour]);

    const handleTimeChange = time => {
        setSelectedEndTime(time);
    };

    const closePicker = () => {
        setIsPickerOpen(false);
    };

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
                {/* {unit !== 'et' ? (
                    <WheelPickerContainer
                        data={unit == 'h' ? options : [options]}
                        inputValues={unit == 'h' ? selected_hour : selected_time}
                        setInputValues={(index, value) => {
                            if (unit === 'h') {
                                const arr = selected_hour;
                                arr[index] = Number(value);
                                setSelectedHour(arr);
                            } else {
                                setSelectedTime([Number(value)]);
                            }
                        }}
                    />
                ) : ( */}
                <TimeWheelPickerContainer
                    is12Hour={false}
                    selectedTime='1:00'
                    startTimeIn24Format='00:00'
                    minutesInterval={1}
                    containerHeight='300'
                    hoursInterval={1}
                />
                {/* )} */}
            </div>
            {unit == 'd' && <DurationEndTimePicker setExpiryDate={setExpiryDate} expiry_date={expiry_date} />}
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
};

export default DurationActionSheetContainer;
