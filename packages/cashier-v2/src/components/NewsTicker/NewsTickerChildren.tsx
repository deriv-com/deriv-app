import React, { Children } from 'react';
import styles from './NewsTicker.module.scss';

type TNewsTickerChildren = {
    animationDuration: number;
    isExceedingParent?: boolean;
    isSecondContainer?: boolean;
    reactChildren: React.ReactNode;
};

const NewsTickerChildren = ({
    animationDuration,
    isExceedingParent,
    isSecondContainer,
    reactChildren: children,
}: TNewsTickerChildren) => (
    <div
        className={styles.children}
        style={
            isExceedingParent
                ? {
                      animationDelay: isSecondContainer ? `-${animationDuration}s` : `-${animationDuration / 2}s`,
                      animationDuration: `${animationDuration}s`,
                  }
                : undefined
        }
    >
        {Children.map(children, (child, idx) => (
            <div className={styles.item} key={idx}>
                {child}
            </div>
        ))}
    </div>
);

export default NewsTickerChildren;
