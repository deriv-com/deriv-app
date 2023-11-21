import React, { ReactNode } from 'react';
import { useSwipeable } from 'react-swipeable';

type THorizontalSwipeProps = {
    is_left_swipe: boolean;
    is_left_swipe_disabled?: boolean;
    is_right_swipe?: boolean;
    is_right_swipe_disabled?: boolean;
    left_hidden_component?: ReactNode;
    left_hidden_component_width?: string;
    right_hidden_component: ReactNode;
    right_hidden_component_width?: string;
    visible_component: ReactNode;
};

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
}: THorizontalSwipeProps) => {
    const [should_show_left_hidden_component, setShouldShowLeftHiddenComponent] = React.useState(false);
    const [should_show_right_hidden_component, setShouldShowRightHiddenComponent] = React.useState(false);
    const visible_component_height_ref = React.useRef<HTMLDivElement>(null);

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

    const transform_style = {
        ...(should_show_left_hidden_component && {
            transform: `translate(${left_hidden_component_width})`,
        }),
        ...(should_show_right_hidden_component && {
            transform: `translate(-${right_hidden_component_width})`,
        }),
    };

    const swipe_handlers = useSwipeable({
        onSwipedLeft: onSwipeLeft,
        onSwipedRight: onSwipeRight,
    });

    return (
        <div {...swipe_handlers}>
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
                <div className='dc-horizontal-swipe--main' ref={visible_component_height_ref} style={transform_style}>
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
        </div>
    );
};

export default HorizontalSwipe;
