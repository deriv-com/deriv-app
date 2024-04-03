import React, { useState } from 'react';
import clsx from 'clsx';
import NewsTickerChildren from './NewsTickerChildren';
import styles from './NewsTicker.module.scss';

type TNewsTicker = {
    children: React.ReactNode;
    className?: string;
    speed: number;
};

const NewsTicker: React.FC<TNewsTicker> = ({ children, className, speed }) => {
    const [elementWidth, setElementWidth] = useState(-1);
    const [isExceedingParent, setIsExceedingParent] = useState(false);

    const onRefChange = (ref: HTMLDivElement) => {
        if (ref) {
            setIsExceedingParent(ref.scrollWidth > ref.clientWidth);

            if (elementWidth === -1) {
                setElementWidth(ref.scrollWidth);
            }
        }
    };

    const animationDuration = elementWidth / speed; // time = distance / speed

    return (
        <div className={clsx(styles.container, className)} ref={onRefChange}>
            <NewsTickerChildren
                animationDuration={animationDuration}
                isExceedingParent={isExceedingParent}
                reactChildren={children}
            />
            {isExceedingParent && (
                <NewsTickerChildren
                    animationDuration={animationDuration}
                    isExceedingParent={isExceedingParent}
                    isSecondContainer
                    reactChildren={children}
                />
            )}
        </div>
    );
};

export default NewsTicker;
