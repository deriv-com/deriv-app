import { WheelPickerContainer } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import { getOptionPerUnit } from 'AppV2/Utils/trade-params-utils';
import clsx from 'clsx';
import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import HourPicker from './hourpicker';

const DurationWheelPicker = observer(
    ({
        unit,
        setWheelPickerValue,
        selected_hour,
        selected_time,
    }: {
        unit: string;
        setWheelPickerValue: (index: number, value: string | number) => void;
        selected_hour: number[];
        selected_time: number[];
    }) => {
        const { duration_min_max, duration_units_list } = useTraderStore();
        const options = React.useMemo(() => getOptionPerUnit(unit, duration_min_max), [unit, duration_min_max]);

        const handleContainerHeight = () => {
            if (unit === 'd') {
                return '228px';
            }
            return duration_units_list.length === 1 ? '230px' : '268px';
        };
        return (
            <div
                className={clsx('duration-container__wheel-picker-container', {
                    'duration-container__wheel-picker-container__single':
                        duration_units_list.length == 1 && unit !== 'd',
                })}
            >
                {unit !== 'h' ? (
                    <WheelPickerContainer
                        data={options}
                        defaultValue={[String(selected_time)]}
                        containerHeight={handleContainerHeight()}
                        inputValues={selected_time}
                        setInputValues={(index, val) => {
                            setWheelPickerValue(index, val);
                        }}
                    />
                ) : (
                    <HourPicker
                        setWheelPickerValue={setWheelPickerValue}
                        selected_hour={selected_hour}
                        selected_time={selected_time}
                        duration_min_max={duration_min_max}
                    />
                )}
            </div>
        );
    }
);

export default DurationWheelPicker;
