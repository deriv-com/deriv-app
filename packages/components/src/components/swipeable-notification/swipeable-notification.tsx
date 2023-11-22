import React from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useSwipeable } from 'react-swipeable';
import Text from '../text';

type TSwipeableNotificationProps = {
    classname?: string;
    content?: React.ReactNode;
    displayed_time?: React.ReactNode;
    is_failure?: boolean;
    is_success?: boolean;
    onUnmount?: () => void;
    redirect_to?: string;
    visibility_duration_ms?: number;
};

const SwipeableNotification = ({
    classname = 'swipeable-notification',
    content,
    displayed_time,
    is_failure,
    is_success,
    onUnmount,
    redirect_to = '',
    visibility_duration_ms,
}: TSwipeableNotificationProps) => {
    const [is_swipe_right, setSwipeRight] = React.useState(false);
    const [is_shown, setIsShown] = React.useState(true);
    const hideNotification = () => setIsShown(false);
    const debouncedHideNotification = React.useMemo(
        () => debounce(hideNotification, visibility_duration_ms),
        [visibility_duration_ms]
    );

    const onSwipeLeft = () => {
        setSwipeRight(false);
        hideNotification();
    };
    const onSwipeRight = () => {
        setSwipeRight(true);
        hideNotification();
    };

    const swipe_handlers = useSwipeable({
        onSwipedLeft: onSwipeLeft,
        onSwipedRight: onSwipeRight,
    });

    React.useEffect(() => {
        return () => {
            debouncedHideNotification.cancel();
        };
    }, [debouncedHideNotification]);

    return (
        <CSSTransition
            appear
            classNames={{
                appear: `${classname}-appear`,
                appearActive: `${classname}-appear-active`,
                appearDone: `${classname}-appear-done`,
                enter: `${classname}-enter`,
                enterActive: `${classname}-enter-active`,
                enterDone: `${classname}-enter-done`,
                exit: `${classname}-exit`,
                exitActive: `${classname}-exit-active-${is_swipe_right ? 'right' : 'left'}`,
            }}
            in={is_shown}
            onEntered={() => {
                if (visibility_duration_ms) debouncedHideNotification();
            }}
            onExited={onUnmount}
            timeout={300}
            unmountOnExit
        >
            <NavLink
                className={classNames(classname, {
                    [`${classname}--failure`]: is_failure,
                    [`${classname}--success`]: is_success,
                })}
                to={redirect_to}
                {...swipe_handlers}
            >
                <div className={`${classname}-content`}>{content}</div>
                <Text as='p' size='xxxs' line_height='s' className={`${classname}-time`}>
                    {displayed_time}
                </Text>
            </NavLink>
        </CSSTransition>
    );
};

export default React.memo(SwipeableNotification);
