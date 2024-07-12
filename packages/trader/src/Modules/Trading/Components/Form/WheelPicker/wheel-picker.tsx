import React, { useState, useEffect } from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { motion } from 'framer-motion';

const variants = {
    enter: (direction: 'up' | 'down') => ({
        x: 0,
        y: direction === 'down' ? 30 : -30,
        opacity: 0,
        transition: {
            duration: 0.24,
            ease: [0, 0, 0, 1],
        },
    }),
    center: {
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.24,
            ease: [0, 0, 0, 1],
        },
    },
    exit: (direction: 'up' | 'down') => ({
        x: 0,
        y: direction === 'down' ? -30 : 30,
        opacity: 0,
        transition: {
            duration: 0.24,
            ease: [0, 0, 0, 1],
        },
    }),
};

type WheelPickerType = {
    onBarrierClick: (id: string) => Promise<void> | void;
    options: string[];
    defaultValue?: string;
};

const WheelPicker = ({ options, onBarrierClick, defaultValue }: WheelPickerType) => {
    const getDefaultIndex = () => {
        if (defaultValue) {
            const index = options.indexOf(defaultValue);
            return index !== -1 ? index : 0;
        }
        return 0;
    };

    const [selectedIndex, setSelectedIndex] = useState(getDefaultIndex());
    const [direction, setDirection] = useState('down');

    useEffect(() => {
        onBarrierClick(options[selectedIndex]);
    }, [selectedIndex, onBarrierClick, options]);

    const handleIndexChange = (newIndex: number, newDirection: 'up' | 'down') => {
        setDirection(newDirection);
        setSelectedIndex(newIndex);
        onBarrierClick(options[newIndex]);
    };

    const handleIncrease = () => {
        if (selectedIndex > 0) {
            handleIndexChange(selectedIndex - 1, 'up');
        }
    };

    const handleDecrease = () => {
        if (selectedIndex < options.length - 1) {
            handleIndexChange(selectedIndex + 1, 'down');
        }
    };

    const visibleValues = () => {
        const values = [];
        if (selectedIndex > 0) {
            values.push(options[selectedIndex - 1]);
        } else {
            values.push('');
        }
        values.push(options[selectedIndex]);
        if (selectedIndex < options.length - 1) {
            values.push(options[selectedIndex + 1]);
        } else {
            values.push('');
        }
        return values;
    };

    return (
        <div className='wheel-picker'>
            <div className='wheel-picker__wheel' key={selectedIndex}>
                {visibleValues().map((value: string, index: number) => (
                    <motion.div
                        key={value}
                        variants={variants}
                        custom={direction}
                        initial='enter'
                        animate='center'
                        exit='exit'
                    >
                        <Text
                            size={index === 1 ? 'xs' : 'xxs'}
                            line_height={index === 1 ? 'l' : 'm'}
                            weight={index === 1 ? 'bolder' : 'bold'}
                            color={index === 1 ? 'default' : 'disabled-1'}
                            align='center'
                            as='p'
                            className={index === 1 ? '' : 'wheel-picker__wheel__placeholder'}
                        >
                            {value}
                        </Text>
                    </motion.div>
                ))}
            </div>
            <div className='wheel-picker__actions'>
                <Button
                    small
                    className='wheel-picker__actions__icon'
                    icon={<Icon icon='IcChevronUp' />}
                    data-testid='up-btn'
                    name='up-btn'
                    onClick={handleIncrease}
                />
                <Button
                    small
                    className='wheel-picker__actions__icon wheel-picker__actions--chevron-up'
                    icon={<Icon icon='IcChevronUp' className='chevron-up' />}
                    name='down-btn'
                    data-testid='down-btn'
                    onClick={handleDecrease}
                />
            </div>
        </div>
    );
};

export default WheelPicker;
