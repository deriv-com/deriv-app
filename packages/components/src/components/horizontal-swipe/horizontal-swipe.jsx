import React from 'react';
import PropTypes from 'prop-types';
import { Swipeable } from 'react-swipeable';

const HorizontalSwipe = ({
    is_left_swipe,
    is_left_swipe_disabled,
    is_right_swipe,
    is_right_swipe_disabled,
    left_hidden_component,
    left_hidden_component_width = '7rem',
    right_hidden_component,
    right_hidden_component_width = '7rem',
    visible_component,
}) => {
    const [should_show_left_hidden_component, setShouldShowLeftHiddenComponent] = React.useState(false);
    const [should_show_right_hidden_component, setShouldShowRightHiddenComponent] = React.useState(false);
    const visible_component_height_ref = React.useRef();

    const onSwipeLeft = () => {
        if (!is_left_swipe_disabled) {
            if (
                (is_left_swipe && should_show_right_hidden_component) ||
                (is_right_swipe && !should_show_left_hidden_component)
            ) {
                return;
            }
            if (is_left_swipe && !should_show_right_hidden_component) {
                setShouldShowRightHiddenComponent(true);
            }
            if (is_right_swipe && should_show_left_hidden_component) {
                setShouldShowLeftHiddenComponent(false);
            }
        }
    };

    const onSwipeRight = () => {
        if (!is_right_swipe_disabled) {
            if (
                (is_left_swipe && !should_show_right_hidden_component) ||
                (is_right_swipe && should_show_left_hidden_component)
            ) {
                return;
            }
            if (is_left_swipe && should_show_right_hidden_component) {
                setShouldShowRightHiddenComponent(false);
            }

            if (is_right_swipe && !should_show_left_hidden_component) {
                setShouldShowLeftHiddenComponent(true);
            }
        }
    };

    return (
        <Swipeable onSwipedLeft={onSwipeLeft} onSwipedRight={onSwipeRight}>
            <div className='dc-horizontal-swipe'>
                {visible_component_height_ref && (
                    <div
                        className='dc-horizontal-swipe--left'
                        style={{
                            height: visible_component_height_ref.current?.clientHeight,
                            width: `${left_hidden_component_width}`,
                        }}
                    >
                        {left_hidden_component}
                    </div>
                )}
                <div
                    className='dc-horizontal-swipe--main'
                    ref={visible_component_height_ref}
                    style={{
                        transform:
                            (should_show_left_hidden_component && `translate(${left_hidden_component_width})`) ||
                            (should_show_right_hidden_component && `translate(-${right_hidden_component_width})`),
                    }}
                >
                    {visible_component}
                </div>
                {visible_component_height_ref && (
                    <div
                        className='dc-horizontal-swipe--right'
                        style={{
                            height: `${visible_component_height_ref.current?.clientHeight}px`,
                            width: `${right_hidden_component_width}`,
                        }}
                    >
                        {right_hidden_component}
                    </div>
                )}
            </div>
        </Swipeable>
    );
};

HorizontalSwipe.propTypes = {
    is_left_swipe: PropTypes.bool,
    is_left_swipe_disabled: PropTypes.bool,
    is_right_swipe: PropTypes.bool,
    is_right_swipe_disabled: PropTypes.bool,
    left_hidden_component: PropTypes.object,
    left_hidden_component_width: PropTypes.string,
    right_hidden_component: PropTypes.object,
    right_hidden_component_width: PropTypes.string,
    visible_component: PropTypes.object,
};

export default HorizontalSwipe;
