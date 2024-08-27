import { Chip, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
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
    return (
        <div className='duration-container__chips'>
            {duration_units_list.concat({ value: 'et', text: 'EndTime' }).map((item, index: number) => (
                <Chip.Selectable
                    key={index}
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
