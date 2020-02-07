import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Swipeable } from 'react-swipeable';

const SwipeableWrapper = ({ children, className, ...props }) => {
    const [active_index, setActiveIndex] = useState(0);

    const swipedLeft = () => {
        const is_reached_end = active_index + 1 === React.Children.count(children);
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
        <Swipeable
            style={{
                transform: `translateX(${active_index * -100}vw)`,
            }}
            className={classNames('dc-swipeable', className)}
            onSwipedLeft={swipedLeft}
            onSwipedRight={swipedRight}
            {...props}
        >
            {childrenWithWrapperDiv}
        </Swipeable>
    );
};

SwipeableWrapper.propTypes = {
    className: PropTypes.string,
};

export default SwipeableWrapper;
