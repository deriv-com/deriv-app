import React, { useState } from 'react';
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
};

const WheelPicker = ({ options, onBarrierClick }: WheelPickerType) => {
    const [selectedIndex, setSelectedIndex] = useState(3);
    const [direction, setDirection] = useState('down');

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
        const start = Math.max(0, selectedIndex - 1);
        const end = Math.min(options.length, selectedIndex + 2);
        return options.slice(start, end);
    };

    return (
        <div className='wheel-picker'>
            <div className='picker-wheel' key={selectedIndex}>
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
                            className={index === 1 ? 'selected-value' : ''}
                        >
                            {value}
                        </Text>
                    </motion.div>
                ))}
            </div>
            <div className='actions'>
                <Button small className='icons' icon={<Icon icon='IcChevronUp' />} onClick={handleIncrease} />
                <Button
                    small
                    className='icons chevron-up'
                    icon={<Icon icon='IcChevronUp' />}
                    onClick={handleDecrease}
                />
            </div>
        </div>
    );
};

export default WheelPicker;
