import { Chip, Text } from '@deriv-com/quill-ui';
import { localize } from '@deriv/translations';
import React from 'react';

const DurationChips = ({
    duration_units_list,
    onChangeUnit,
    unit,
}: {
    duration_units_list: { text: string; value: string }[];
    onChangeUnit: (arg: string) => void;
    unit: string;
}) => {
    const list =
        duration_units_list.length == 1 && duration_units_list[0].value == 't'
            ? duration_units_list
            : duration_units_list.concat({ value: 'et', text: localize('End Time') });

    return (
        <div className='duration-container__chips'>
            {list.map(item => (
                <Chip.Selectable
                    key={item.text}
                    selected={unit == item.value}
                    className='duration-container__chips__chip'
                    onClick={() => onChangeUnit(item.value)}
                >
                    <Text size='sm'>{item.text}</Text>
                </Chip.Selectable>
            ))}
        </div>
    );
};

export default DurationChips;
