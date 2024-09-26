import { WheelPickerContainer } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import { getOptionPerUnit } from 'AppV2/Utils/trade-params-utils';
import clsx from 'clsx';
import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';

const DurationWheelPicker = observer(
    ({
        unit,
        setWheelPickerValue,
        selected_hour,
        selected_time,
        is24_hour_selected,
        setIs24HourSelected,
    }: {
        unit: string;
        setWheelPickerValue: (index: number, value: string | number) => void;
        selected_hour: number[];
        selected_time: number[];
        is24_hour_selected: boolean;
        setIs24HourSelected: (arg: boolean) => void;
    }) => {
        const { duration_min_max } = useTraderStore();

        const options = React.useMemo(
            () => getOptionPerUnit(unit, duration_min_max?.tick?.min === 5),
            [unit, duration_min_max]
        );

        return (
            <div className={clsx('duration-container__wheel-picker-container')}>
                <div
                    className={clsx({
                        'duration-container__wheel-picker-container__loading': false,
                    })}
                >
                    <WheelPickerContainer
                        data={!is24_hour_selected ? options : [options[0], [{ ...options[1][0] }]]}
                        defaultValue={[String(selected_time)]}
                        containerHeight={unit == 'd' ? '228px' : '268px'}
                        inputValues={unit == 'h' ? selected_hour : selected_time}
                        setInputValues={(index, val) => {
                            if (unit == 'h') {
                                if (index == 0 && val === 24) {
                                    setIs24HourSelected(true);
                                } else if (index == 0 && val !== 24) {
                                    setIs24HourSelected(false);
                                }
                            } else {
                                setIs24HourSelected(false);
                            }

                            setWheelPickerValue(index, val);
                        }}
                    />
                </div>
            </div>
        );
    }
);

export default DurationWheelPicker;
