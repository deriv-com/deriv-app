import classNames from 'classnames';
import React from 'react';
import { SwipeableProps, useSwipeable } from 'react-swipeable';
import Icon from '../icon';

type TSwipeableWrapper = {
    className?: string;
    onChange?: (prop?: number) => void;
    is_disabled?: boolean;
    is_swipe_disabled?: boolean;
    should_elevate_navigation?: boolean;
} & SwipeableProps;

const SwipeableWrapper = ({
    children,
    className,
    onChange,
    is_disabled,
    is_swipe_disabled,
    should_elevate_navigation = false,
    ...props
}: React.PropsWithChildren<TSwipeableWrapper>) => {
    const [active_index, setActiveIndex] = React.useState(0);

    React.useEffect(() => {
        onChange?.(active_index);
        return () => {
            // Makes an empty callback when unmounted so that we can reset
            onChange?.();
        };
    }, [active_index, onChange]);

    const swipedLeft = (is_nav_click = false) => {
        if (is_disabled) return;
        if (is_swipe_disabled && !is_nav_click) return;
        const is_reached_end = active_index + 1 === React.Children.toArray(children).length;
        if (!is_reached_end) {
            setActiveIndex(active_index + 1);
        }
    };

    const swipedRight = (is_nav_click = false) => {
        if (is_disabled) return;
        if (is_swipe_disabled && !is_nav_click) return;
        if (active_index > 0) {
            setActiveIndex(active_index - 1);
        }
    };

    const childrenWithWrapperDiv = React.Children.map(children, child => {
        return <div className='dc-swipeable__item'>{child}</div>;
    });

    const swipe_handlers = useSwipeable({
        onSwipedLeft: () => swipedLeft(false),
        onSwipedRight: () => swipedRight(false),
        ...props,
    });

    return (
        <div className='dc-swipeable' data-testid='dt_swipeable'>
            <div
                {...swipe_handlers}
                style={{
                    left: `${is_disabled ? -100 : active_index * -100}vw`,
                }}
                className={classNames('dc-swipeable__view', className)}
                {...props}
            >
                {childrenWithWrapperDiv}
            </div>
            {!is_disabled && (
                <nav
                    className={classNames('dc-swipeable__nav', {
                        'dc-swipeable__nav-elevated': should_elevate_navigation,
                    })}
                >
                    <Icon
                        className='dc-swipeable__nav__item'
                        icon='IcChevronDoubleLeft'
                        size={24}
                        onClick={() => swipedRight(true)}
                        color={active_index === 0 || is_disabled ? 'disabled' : ''}
                    />
                    <Icon
                        className='dc-swipeable__nav__item'
                        icon='IcChevronDoubleRight'
                        size={24}
                        onClick={() => swipedLeft(true)}
                        color={
                            active_index + 1 === React.Children.toArray(children).length || is_disabled
                                ? 'disabled'
                                : ''
                        }
                    />
                </nav>
            )}
        </div>
    );
};

SwipeableWrapper.useSwipeable = useSwipeable;

export default SwipeableWrapper;
