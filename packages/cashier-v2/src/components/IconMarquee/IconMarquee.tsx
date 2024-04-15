import React from 'react';
import { TIconTypes } from '../../types';
import { NewsTicker } from '../NewsTicker';
import styles from './IconMarquee.module.scss';

type TProps = {
    animationSpeed?: number;
    hasLeftShadow?: boolean;
    hasRightShadow?: boolean;
    iconHeight: number;
    iconWidth: number;
    icons: TIconTypes.TIcon[];
};

const IconMarquee: React.FC<TProps> = ({
    animationSpeed = 10,
    hasLeftShadow = false,
    hasRightShadow = false,
    iconHeight,
    iconWidth,
    icons,
}) => {
    return (
        <div className={styles.container} data-testid='dt_icon_marquee'>
            {hasLeftShadow && (
                <div className={`${styles.shadow} ${styles['shadow--left']}`} data-testid='dt_shadow_left' />
            )}
            <NewsTicker className={styles['icon-marquee']} speed={animationSpeed}>
                <div className={styles['icons-container']}>
                    {icons.map(({ icon: Icon, key }) => (
                        <Icon height={iconHeight} key={key} width={iconWidth} />
                    ))}
                </div>
            </NewsTicker>
            {hasRightShadow && (
                <div className={`${styles.shadow} ${styles['shadow--right']}`} data-testid='dt_shadow_right' />
            )}
        </div>
    );
};

export default IconMarquee;
