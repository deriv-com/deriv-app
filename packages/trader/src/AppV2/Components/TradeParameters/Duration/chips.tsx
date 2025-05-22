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
    const show_end_time = duration_units_list.length > 1;

    if (!show_end_time) {
        return <></>;
    }

    return (
        <div className='duration-container__chips'>
            {duration_units_list.map(
                (item, index) =>
                    item.value !== 'd' && (
                        <Chip.Selectable
                            key={`${item.text}-${index}`}
                            selected={unit == item.value}
                            className='duration-container__chips__chip'
                            onClick={() => unit !== item.value && onChangeUnit(item.value)}
                        >
                            <Text size='sm'>{item.text}</Text>
                        </Chip.Selectable>
                    )
            )}
            {show_end_time && (
                <Chip.Selectable
                    key='end-time'
                    selected={unit === 'd'}
                    className='duration-container__chips__chip'
                    onClick={() => onChangeUnit('d')}
                >
                    <Text size='sm'>
                        <Localize i18n_default_text='End Time' />
                    </Text>
                </Chip.Selectable>
            )}
        </div>
    );
};

export default DurationChips;
