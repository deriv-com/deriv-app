import React, { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Text } from '@deriv/components';
import { motion } from 'framer-motion';

type WheelPickerMobileProps = {
    defaultValue?: string;
    onChange?: (val: string) => void;
    options: string[];
    currency: string;
    optionHeight?: number;
};

type SwipeState = {
    startY: number;
    deltaY: number;
    translateY: number;
};

const calculateCharacterWidth = (str: string) => {
    const charWidths = {
        uppercase: 1.5,
        lowercase: 0.8,
        number: 1.5,
        punctuation: 0.7,
        default: 1.0,
    };

    return [...str].reduce((totalWidth, char) => {
        if (/[A-Z]/.test(char)) {
            return totalWidth + charWidths.uppercase;
        } else if (/[a-z]/.test(char)) {
            return totalWidth + charWidths.lowercase;
        } else if (/[0-9]/.test(char)) {
            return totalWidth + charWidths.number;
        } else if (/[\.,:;!?]/.test(char)) {
            return totalWidth + charWidths.punctuation;
        }
        return totalWidth + charWidths.default;
    }, 0);
};

export function getTargetIndex({
    deltaY,
    snapTolerance,
    optionHeight,
    options,
    selectedIndex,
}: {
    deltaY: number;
    snapTolerance: number;
    optionHeight: number;
    options: string[];
    selectedIndex: number;
}) {
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

const calculateLimits = (swipeStartY: number, deltaY: number, optionHeight: number, optionsLength: number) => {
    const MIN = 0;
    const MAX = optionHeight * (optionsLength - 1);
    const translateY = Math.min(MAX, Math.max(MIN, swipeStartY + deltaY));
    const newIndex = Math.min(optionsLength - 1, Math.max(0, Math.round(translateY / optionHeight)));

    return { translateY, newIndex };
};

const WheelPickerMobile: React.FC<WheelPickerMobileProps> = ({
    defaultValue,
    onChange,
    currency,
    options,
    optionHeight = 28,
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(options.length - 1);

    const [swipe, setSwipe] = useState<SwipeState>({ startY: 0, deltaY: 0, translateY: 0 });
    const optionRef = useRef<HTMLDivElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    const swipeableHandlers = useSwipeable({
        onSwipeStart: eventData => {
            eventData.event.stopPropagation();
            if (pickerRef.current && pickerRef.current.contains(eventData.event.target as Node)) {
                setSwipe(swipe => ({ ...swipe, startY: swipe.translateY }));
            }
        },
        onSwiping: ({ deltaY, first, event }) => {
            event.stopPropagation();
            if (first || (pickerRef.current && !pickerRef.current.contains(event.target as Node))) return;
            const { translateY, newIndex } = calculateLimits(swipe.startY, deltaY, optionHeight, options.length);
            setSwipe(swipe => ({
                ...swipe,
                deltaY,
                translateY: (translateY + optionHeight * newIndex) / 2,
            }));
            setSelectedIndex(newIndex);
        },
        onSwiped: ({ deltaY, event }) => {
            event.stopPropagation();
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) return;
            const { newIndex } = calculateLimits(swipe.startY, deltaY, optionHeight, options.length);
            setSwipe(swipe => ({ ...swipe, deltaY: 0, translateY: optionHeight * newIndex }));
            setSelectedIndex(newIndex);
        },
        trackMouse: true,
        delta: optionHeight,
    });

    useEffect(() => {
        const defaultValueIndex = options.findIndex(o => o === defaultValue);
        setSelectedIndex(defaultValueIndex !== -1 ? defaultValueIndex : options.length - 1);
    }, []);

    useEffect(() => {
        const translateY = optionHeight * selectedIndex;
        setSwipe(swipe => ({ ...swipe, translateY }));
    }, [selectedIndex, options, optionHeight]);

    useEffect(() => {
        onChange?.(options[selectedIndex]);
    }, [selectedIndex, onChange, options]);

    const translateValue = `translateY(${-swipe.translateY}px)`;
    const wheelStyle = {
        transform: translateValue,
        width: '100%',
        top: `calc(50% - ${optionHeight / 2}px)`,
    };

    const getFontSize = (index: number) => {
        if (index === selectedIndex) return 'xsm';
        if (index === selectedIndex - 1 || index === selectedIndex + 1) return 'xs';
        return 'xxs';
    };
    const dynamicPadding = (currency: string, options: string[]) => {
        const basePadding = 40;
        const paddingMultiplier = 8;

        const currencyWidth = calculateCharacterWidth(currency);
        const maxOptionWidth = Math.max(...options.map(option => calculateCharacterWidth(option)));
        let maxContentWidth = Math.max(currencyWidth, maxOptionWidth);
        if (currencyWidth === maxOptionWidth) {
            maxContentWidth += 2;
        }

        return basePadding + maxContentWidth * paddingMultiplier;
    };

    return (
        <div className='wheel-picker-mobile'>
            <div className='picker-selected-wrapper'>
                <div className='picker-selected'>
                    <Text
                        size='l'
                        weight='bolder'
                        color='prominent'
                        align='center'
                        as='h1'
                        className='currency-label'
                        style={{
                            paddingLeft: `${dynamicPadding(currency, options)}px`,
                        }}
                    >
                        {currency}
                    </Text>
                </div>
            </div>
            <div className='picker-viewport' ref={pickerRef}>
                <div className='picker-wheel' data-testid='picker-wheel' style={wheelStyle} {...swipeableHandlers}>
                    {options.map((option, index) => (
                        <motion.div
                            key={`option-${index}`}
                            style={{ height: optionHeight }}
                            className='picker-wheel__options'
                            onMouseUp={() => setSelectedIndex(index)}
                            transition={{ type: 'spring', stiffness: 300 }}
                            ref={index === selectedIndex ? optionRef : null}
                        >
                            <Text
                                size={getFontSize(index)}
                                weight={index === selectedIndex ? 'bolder' : 'bold'}
                                color={index === selectedIndex ? 'prominent' : 'disabled-1'}
                                align='center'
                                as='p'
                            >
                                {option}
                            </Text>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WheelPickerMobile;
