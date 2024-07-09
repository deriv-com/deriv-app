import React, { useState } from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { motion } from 'framer-motion';
import { useDevice } from '@deriv-com/ui';
import { useSwipeable } from 'react-swipeable';

export const variants = {
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            ease: 'easeOut',
            duration: 0.3,
        },
    },
    hide: {
        y: -30,
        opacity: 0,
        scale: 0.8,
    },
};

const defaultOptions = ['0.12', '0.21', '0.22', '0.34', '0.33', '0.38', '0.09', '0.76', '0.77', '0.78', '0.79', '80'];

const WheelPicker = ({
    options = defaultOptions,
    onBarrierClick,
}: {
    options?: string[];
    onBarrierClick: (val: string) => void;
}) => {
    const [selectedIndex, setSelectedIndex] = useState(3);
    const { isDesktop } = useDevice();

    const handleIndexChange = (newIndex: number) => {
        setSelectedIndex(newIndex);
        onBarrierClick(options[newIndex]);
    };

    const handleIncrease = () => {
        if (selectedIndex > 0) {
            handleIndexChange(selectedIndex - 1);
        }
    };

    const handleDecrease = () => {
        if (selectedIndex < options.length - 1) {
            handleIndexChange(selectedIndex + 1);
        }
    };

    const getVisibleValues = () => {
        if (isDesktop) {
            if (selectedIndex === 0) {
                return [null, options[0], options[1]];
            } else if (selectedIndex === options.length - 1) {
                return [options[options.length - 2], options[options.length - 1], null];
            }
            return options.slice(selectedIndex - 1, selectedIndex + 2);
        }
        if (selectedIndex <= 2) {
            return [null, ...options.slice(0, 4)];
        } else if (selectedIndex >= options.length - 3) {
            return [...options.slice(options.length - 4), null];
        }
        return options.slice(selectedIndex - 2, selectedIndex + 3);
    };

    const visibleValues = getVisibleValues();

    return (
        <>
            {isDesktop ? (
                <div className='wheel-picker'>
                    <div className='digits'>
                        {visibleValues.map((value, index) => (
                            <motion.div
                                key={`wheel-desktop-${value}`}
                                variants={variants}
                                initial='initial'
                                animate={selectedIndex === index ? 'animate' : 'initial'}
                            >
                                <Text
                                    size={index === 1 ? 'xxs' : 'xxxs'}
                                    line_height='l'
                                    weight={index === 1 ? 'bolder' : 'bold'}
                                    color={index === 1 ? 'default' : 'disabled-1'}
                                    align='center'
                                    as='p'
                                    className={index === 1 ? 'selected-value' : ''}
                                >
                                    {value !== null ? `${Number(value)} ${index === 1 ? 'USD' : ''}` : ''}
                                </Text>
                            </motion.div>
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
            ) : (
                <></>
            )}
        </>
    );
};

export default WheelPicker;
