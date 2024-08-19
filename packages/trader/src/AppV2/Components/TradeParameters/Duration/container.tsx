import React, { useState } from 'react';
import { ActionSheet, Chip, Text, WheelPickerContainer } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getOptionPerUnit } from './util';

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
];
const DurationActionSheetContainer = () => {
    const { duration, duration_unit, onChangeMultiple } = useTraderStore();
    const [unit, setUnit] = useState(duration_unit);
    const [selected_time, setSelectedTime] = useState([10]);
    const [selected_hour, setSelectedHour] = useState([]);

    // const onChangeTime = (num: number | string) => {
    //     setSelectedTime(num);
    // };

    // const onChangeUnit = (value: string) => {
    //     setUnit('m');
    // };
    console.log(selected_time);
    return (
        <div className='duration-container'>
            <div className='duration-container__header'>
                <Text bold>
                    <Localize i18n_default_text='Duration' />
                </Text>
            </div>
            {/* <div className='duration-container__chips'>
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
            </div> */}
            <div className='duration-container__wheel-picker'>
                <WheelPickerContainer
                    data={[getOptionPerUnit('m')]}
                    inputValues={selected_time}
                    setInputValues={(index, value) => {
                        console.log(value);
                        // setSelectedTime([value]);
                    }}
                />
            </div>
            {/* <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Save' />,
                    onAction: () => {
                        onChangeMultiple({
                            duration_unit: unit,
                            duration: Number(selected_time),
                        });
                    },
                }}
            /> */}
        </div>
    );
};

export default DurationActionSheetContainer;
