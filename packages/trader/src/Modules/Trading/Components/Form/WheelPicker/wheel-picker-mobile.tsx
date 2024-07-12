import React, { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Text } from '@deriv/components';
import { AnimatePresence, motion } from 'framer-motion';


type WheelPickerMobileProps = {
    defaultValue?: string;
    onChange?: (val: string) => void;
    options?: string[];
    optionHeight?: number;
};

export function getTargetIndex({
    deltaY = 0,
    snapTolerance = 0.5,
    optionHeight = 0,
    options = [],
    selectedIndex = 0,
} = {}) {
    const absDeltaY = Math.abs(deltaY);
    const yLeftover = absDeltaY % optionHeight;
    const snapThreshold = Math.round(optionHeight * snapTolerance);
    const snapY = Number(yLeftover >= snapThreshold);

    const absDeltaIndex = Math.floor(absDeltaY / optionHeight) + snapY;
    const deltaIndex = absDeltaIndex * Math.sign(deltaY) * -1;

    const MIN_INDEX = 0;
    const MAX_INDEX = options.length - 1;
    const targetIndex = Math.min(MAX_INDEX, Math.max(MIN_INDEX, selectedIndex + deltaIndex));
    return targetIndex;
}

const WheelPickerMobile: React.FC<WheelPickerMobileProps> = ({
    defaultValue,
    onChange = (val: string) => {},
    options,
    optionHeight = 30
})=> {
    const [selectedIndex, setSelectedIndex] = useState(options.length - 1);
    const [optionWidth, setOptionWidth] = useState(0);

    const [swipe, setSwipe] = useState({ startY: 0, deltaY: 0, translateY: 0 });
    const optionRef = useRef<HTMLDivElement>(null);
    const swipeableHandlers = useSwipeable({
        onSwipeStart: () => {
            setSwipe(swipe => ({ ...swipe, startY: swipe.translateY }));
        },

        onSwiping: ({ deltaY, first }) => {
            if (first) return;
            const MIN = 0;
            const MAX = optionHeight * (options.length - 1);
            const translateY = Math.min(MAX, Math.max(MIN, swipe.startY + deltaY));
            const newIndex = Math.min(options.length - 1, Math.max(0, Math.round(translateY / optionHeight)));
            setSwipe(swipe => ({
                ...swipe,
                deltaY,
                translateY: (translateY + optionHeight * newIndex) / 2,
            }));
            setSelectedIndex(newIndex);
        },

        onSwiped: ({ deltaY }) => {
            const MIN = 0;
            const MAX = optionHeight * (options.length - 1);
            const translateY = Math.min(MAX, Math.max(MIN, swipe.startY + deltaY));
            const newIndex = Math.min(options.length - 1, Math.max(0, Math.round(translateY / optionHeight)));
            setSwipe(swipe => ({ ...swipe, deltaY: 0, translateY: optionHeight * newIndex }));
        },
        trackMouse: true,
        delta: optionHeight,
    });

    useEffect(() => {
        const defaultValueIndex = options.findIndex(o => o === defaultValue);
        setSelectedIndex(defaultValueIndex);
    }, []);

    useEffect(() => {
        const translateY = optionHeight * selectedIndex;
        setSwipe(swipe => ({ ...swipe, translateY }));
    }, [selectedIndex, options, optionHeight]);

    useEffect(() => {
        if (onChange) onChange(options[selectedIndex]);
        if (optionRef.current) {
            setOptionWidth(optionRef.current.offsetWidth);
        }
    }, [selectedIndex, onChange, options]);

    const handleClick = (index: number) => {
        setSelectedIndex(index);
    };

    const translateValue = `translateY(${-swipe.translateY}px)`;
    const wheelStyle = {
        MozTransform: translateValue,
        MsTransform: translateValue,
        OTransform: translateValue,
        transform: translateValue,
        WebkitTransform: translateValue,
        width: '100%',
        top: `calc(50% - ${optionHeight / 2}px)`,
    };
    return <div className='wheel-picker-mobile'>
            <div className='picker-selected-wrapper'>
                <div className='picker-selected'>
                    <Text
                        size='l'
                        weight='bolder'
                        color='default'
                        align='center'
                        as='h1'
                        className='currency-label'
                        style={{
                            paddingLeft: optionWidth + 60,
                        }}
                    >
                        USD
                    </Text>
                </div>
            </div>
            <div className='picker-viewport'>
                <div className='picker-wheel' style={wheelStyle} {...swipeableHandlers}>
                    {options.map((option, index) => (
                        <motion.div
                            key={`option-${index}`}
                            style={{
                                height: optionHeight,
                            }}
                            className='options'
                            onMouseUp={() => handleClick(index)}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <div ref={index === selectedIndex ? optionRef : null}>
                                <Text
                                    size={index === selectedIndex ? 's' : 'xs'}
                                    weight={index === selectedIndex ? 'bolder' : 'bold'}
                                    color={index === selectedIndex ? '' : 'disabled-1'}
                                    align='center'
                                    as='p'
                                >
                                    {option}
                                </Text>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
}

export default WheelPickerMobile;