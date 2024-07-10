import React, { useState } from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { motion, AnimatePresence } from 'framer-motion';

const defaultOptions = ['0.12', '0.21', '0.22', '0.34', '0.33', '0.38', '0.09', '0.76', '0.77', '0.78', '0.79', '80'];

const variants = {
    enter: direction => ({
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
    exit: direction => ({
        x: 0,
        y: direction === 'down' ? -30 : 30,
        opacity: 0,
        transition: {
            duration: 0.24,
            ease: [0, 0, 0, 1],
        },
    }),
};

const WheelPicker = ({ options = defaultOptions, onBarrierClick }) => {
    const [selectedIndex, setSelectedIndex] = useState(3);
    const [direction, setDirection] = useState('down');

    const handleIndexChange = (newIndex, newDirection) => {
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
                    {visibleValues().map((value, index) => (
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
