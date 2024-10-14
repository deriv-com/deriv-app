/* eslint-disable no-lonely-if */
import { WheelPickerContainer } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import { getOptionPerUnit } from 'AppV2/Utils/trade-params-utils';
import clsx from 'clsx';
import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Localize } from '@deriv/translations';

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
                <WheelPickerContainer
                    data={
                        selected_hour.length > 0 && selected_hour[0] == 24
                            ? [
                                  options[0],
                                  [
                                      {
                                          value: 0,
                                          label: <Localize i18n_default_text='0 min' />,
                                      },
                                  ],
                              ]
                            : options
                    }
                    defaultValue={[String(selected_time)]}
                    containerHeight={handleContainerHeight()}
                    inputValues={unit == 'h' ? selected_hour : selected_time}
                    setInputValues={(index, val) => {
                        setWheelPickerValue(index, val);
                    }}
                />
            </div>
        );
    }
);

export default DurationWheelPicker;
