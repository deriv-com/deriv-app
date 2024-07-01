import React, { useState } from 'react';
import { Button, Icon, Text } from '@deriv/components';

const WheelPicker = () => {
    const values = [0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.21, 0.22, 0.23, 0.24];
    const [selectedIndex, setSelectedIndex] = useState(3);

    const handleIncrease = () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const handleDecrease = () => {
        if (selectedIndex < values.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    const getVisibleValues = () => {
        if (selectedIndex === 0) {
            return [null, values[0], values[1]];
        } else if (selectedIndex === values.length - 1) {
            return [values[values.length - 2], values[values.length - 1], null];
        }
        return values.slice(selectedIndex - 1, selectedIndex + 2);
    };

    const visibleValues = getVisibleValues();

    return (
        <div className='wheel-picker'>
            <div className='digits'>
                {visibleValues.map((value, index) => (
                    <Text
                        key={index}
                        size={index === 1 ? 'xs' : 'xxs'}
                        line_height='l'
                        weight={index === 1 ? 'bolder' : 'bold'}
                        color={index === 1 ? 'default' : 'disabled-1'}
                        align='center'
                        as='p'
                        className={index === 1 ? 'selected-value' : ''}
                    >
                        {value !== null ? `${value.toFixed(2)} USD` : ''}
                    </Text>
                ))}
            </div>
            <div className='actions'>
                <Button small className='icons' icon={<Icon icon='IcChevronUp' />} onClick={handleIncrease} />
                <Button
                    small
                    className='icons'
                    icon={<Icon icon='IcChevronUp' className='chevron-up' />}
                    onClick={handleDecrease}
                />
            </div>
        </div>
    );
};

export default WheelPicker;
