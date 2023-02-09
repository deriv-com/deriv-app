import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useSwipeable } from 'react-swipeable';
import Icon from '../icon';

const SwipeableWrapper = ({ children, className, onChange, ...props }) => {
    const [active_index, setActiveIndex] = React.useState(0);

    React.useEffect(() => {
        if (typeof onChange === 'function') onChange(active_index);
        return () => {
            // Makes an empty callback when unmounted so that we can reset
            if (typeof onChange === 'function') onChange();
        };
    }, [active_index, onChange]);

    const swipedLeft = () => {
        if (props.is_disabled) return;
        const is_reached_end = active_index + 1 === React.Children.toArray(children).length;
        if (!is_reached_end) {
            setActiveIndex(active_index + 1);
        }
    };

    const swipedRight = () => {
        if (props.is_disabled) return;
        if (active_index > 0) {
            setActiveIndex(active_index - 1);
        }
    };

    const childrenWithWrapperDiv = React.Children.map(children, child => {
        return <div className='dc-swipeable__item'>{child}</div>;
    });

    const swipe_handlers = useSwipeable({
        onSwipedLeft: swipedLeft,
        onSwipedRight: swipedRight,
        ...props,
    });

    return (
        <div className='dc-swipeable'>
            <div
                {...swipe_handlers}
                style={{
                    transform: `translateX(${props.is_disabled ? -100 : active_index * -100}vw)`,
                }}
                className={classNames('dc-swipeable__view', className)}
                {...props}
            >
                {childrenWithWrapperDiv}
            </div>
            {!props.is_disabled && (
                <nav className='dc-swipeable__nav'>
                    <Icon
                        className='dc-swipeable__nav__item'
                        icon='IcChevronDoubleLeft'
                        size={24}
                        onClick={swipedRight}
                        color={active_index === 0 || props.is_disabled ? 'disabled' : ''}
                    />
                    <Icon
                        className='dc-swipeable__nav__item'
                        icon='IcChevronDoubleRight'
                        size={24}
                        onClick={swipedLeft}
                        color={
                            active_index + 1 === React.Children.toArray(children).length || props.is_disabled
                                ? 'disabled'
                                : ''
                        }
                    />
                </nav>
            )}
        </div>
    );
};

SwipeableWrapper.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node), PropTypes.object]),
    onChange: PropTypes.func,
    is_disabled: PropTypes.bool,
};

export default SwipeableWrapper;
