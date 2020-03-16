import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Swipeable } from 'react-swipeable';
import Icon from 'Components/icon';

const SwipeableWrapper = ({ children, className, onChange, ...props }) => {
    const [active_index, setActiveIndex] = useState(0);

    useEffect(() => {
        if (typeof onChange === 'function') onChange(active_index);
        return () => {
            // Makes an empty callback when unmounted so that we can reset
            if (typeof onChange === 'function') onChange();
        };
    }, [active_index]);

    const swipedLeft = () => {
        const is_reached_end = active_index + 1 === React.Children.toArray(children).length;
        if (!is_reached_end) {
            setActiveIndex(active_index + 1);
        }
    };

    const swipedRight = () => {
        if (active_index > 0) {
            setActiveIndex(active_index - 1);
        }
    };

    const childrenWithWrapperDiv = React.Children.map(children, child => {
        return <div className='dc-swipeable__item'>{child}</div>;
    });

    return (
        <div className='dc-swipeable'>
            <Swipeable
                style={{
                    transform: `translateX(${active_index * -100}vw)`,
                }}
                className={classNames('dc-swipeable__view', className)}
                onSwipedLeft={swipedLeft}
                onSwipedRight={swipedRight}
                {...props}
            >
                {childrenWithWrapperDiv}
            </Swipeable>
            <nav className='dc-swipeable__nav'>
                <Icon
                    className='dc-swipeable__nav__item'
                    icon='IcChevronDoubleLeft'
                    size={24}
                    onClick={swipedRight}
                    color={active_index === 0 ? 'disabled' : ''}
                />
                <Icon
                    className='dc-swipeable__nav__item'
                    icon='IcChevronDoubleRight'
                    size={24}
                    onClick={swipedLeft}
                    color={active_index + 1 === React.Children.toArray(children).length ? 'disabled' : ''}
                />
            </nav>
        </div>
    );
};

SwipeableWrapper.propTypes = {
    className: PropTypes.string,
};

export default SwipeableWrapper;
