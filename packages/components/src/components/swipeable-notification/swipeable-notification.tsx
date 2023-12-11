import React from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useSwipeable } from 'react-swipeable';
import { Localize } from '@deriv/translations';
import { getTimeSince } from '@deriv/shared';
import Text from '../text';

type TSwipeableNotificationProps = React.PropsWithChildren<{
    classname?: string;
    is_failure?: boolean;
    is_success?: boolean;
    onUnmount?: () => void;
    redirect_to?: string;
    timestamp?: number | null;
    visibility_duration_ms?: number;
}>;

const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right',
};

const SwipeableNotification = ({
    children,
    classname = 'swipeable-notification',
    is_failure,
    is_success,
    onUnmount,
    redirect_to = '',
    timestamp,
    visibility_duration_ms,
}: TSwipeableNotificationProps) => {
    const [swipe_direction, setSwipeDirection] = React.useState(DIRECTION.LEFT);
    const [is_visible, setIsVisible] = React.useState(true);
    const getSeconds = React.useCallback((timestamp?: number | null) => {
        return timestamp ? Math.abs(Math.floor(Date.now() / 1000) - timestamp) : null;
    }, []);
    const [seconds, setSeconds] = React.useState<number | null>(getSeconds(timestamp));
    const interval_ref = React.useRef<ReturnType<typeof setInterval>>();

    const hideNotification = () => setIsVisible(false);
    const debouncedHideNotification = React.useMemo(
        () => debounce(hideNotification, visibility_duration_ms),
        [visibility_duration_ms]
    );
    const getDisplayedTime = () => {
        if (!seconds && seconds !== 0) return;
        return seconds < 10 ? <Localize i18n_default_text='now' /> : getTimeSince(Number(timestamp) * 1000);
    };
    const onSwipe = (direction: string) => {
        setSwipeDirection(direction);
        hideNotification();
    };
    const swipe_handlers = useSwipeable({
        onSwipedLeft: () => onSwipe(DIRECTION.LEFT),
        onSwipedRight: () => onSwipe(DIRECTION.RIGHT),
    });

    React.useEffect(() => {
        if (timestamp) {
            interval_ref.current = setInterval(() => {
                setSeconds(getSeconds(timestamp));
            }, 1000);
        }
        return () => {
            if (visibility_duration_ms) debouncedHideNotification.cancel();
            if (timestamp && interval_ref.current) clearInterval(interval_ref.current);
        };
    }, [debouncedHideNotification, getSeconds, timestamp, visibility_duration_ms]);

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
                exitActive: `${classname}-exit-active-${swipe_direction}`,
            }}
            in={is_visible}
            onEntered={() => {
                if (visibility_duration_ms) debouncedHideNotification();
            }}
            onExited={onUnmount}
            timeout={{
                enter: 300,
                exit: 600,
            }}
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
                <div className={`${classname}-content`}>{children}</div>
                <Text as='p' size='xxxs' line_height='s' className={`${classname}-time`}>
                    {getDisplayedTime()}
                </Text>
            </NavLink>
        </CSSTransition>
    );
};

export default React.memo(SwipeableNotification);
