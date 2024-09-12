import React, { useState, useEffect } from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { motion } from 'framer-motion';

const transition = {
    duration: 0.24,
    ease: [0, 0, 0, 1],
};

const variants = {
    enter: (direction: 'up' | 'down') => ({
        x: 0,
        y: direction === 'down' ? 30 : -30,
        opacity: 0,
        transition,
    }),
    center: {
        x: 0,
        y: 0,
        opacity: 1,
        transition,
    },
    exit: (direction: 'up' | 'down') => ({
        x: 0,
        y: direction === 'down' ? -30 : 30,
        opacity: 0,
        transition,
    }),
};

type WheelPickerType = {
    onClick: (id: string) => Promise<void> | void;
    options: string[];
    defaultValue?: string;
    currency?: string;
};

const WheelPicker = ({ options, onClick, defaultValue, currency }: WheelPickerType) => {
    const [selectedIndex, setSelectedIndex] = useState(Math.floor(options.length / 2));
    const [direction, setDirection] = useState('down');

    useEffect(() => {
        if (defaultValue) {
            setSelectedIndex(options.indexOf(defaultValue));
        }
    }, [defaultValue, options]);

    const handleIndexChange = (newIndex: number, newDirection: 'up' | 'down') => {
        setDirection(newDirection);
        setSelectedIndex(newIndex);
        onClick(options[newIndex]);
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
        const values = [options[selectedIndex - 1] || '', options[selectedIndex], options[selectedIndex + 1] || ''];
        return values;
    };
    const hasUndefinedValues = visibleValues().some(option => option === undefined);

    return (
        <div className='wheel-picker'>
            <div className='wheel-picker__wheel' key={selectedIndex}>
                {options.length > 0 &&
                    !hasUndefinedValues &&
                    visibleValues().map((value: string | number, index: number) => (
                        <motion.div
                            key={index}
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
                                {value} {value !== '' ? currency : ''}
                            </Text>
                        </motion.div>
                    ))}
            </div>
            <div className='wheel-picker__actions'>
                <Button
                    disabled={selectedIndex === 0}
                    small
                    className='wheel-picker__actions__btn'
                    data-testid='dt_up_btn'
                    name='up-btn'
                    onClick={handleIncrease}
                >
                    <Icon
                        icon='IcChevronUp'
                        color={selectedIndex === 0 ? 'disabled' : 'black'}
                        className='chevron-icon'
                    />
                </Button>
                <Button
                    small
                    disabled={selectedIndex === options.length - 1}
                    className='wheel-picker__actions__btn  wheel-picker__actions--chevron-up'
                    name='down-btn'
                    data-testid='dt_down_btn'
                    onClick={handleDecrease}
                >
                    <Icon
                        icon='IcChevronUp'
                        color={selectedIndex === options.length - 1 ? 'disabled' : 'black'}
                        className='chevron-up'
                    />
                </Button>
            </div>
        </div>
    );
};

export default WheelPicker;
