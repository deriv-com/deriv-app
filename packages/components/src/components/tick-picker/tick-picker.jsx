import classNames from 'classnames';
import React from 'react';
import throttle from 'lodash.throttle';
import { useSwipeable } from 'react-swipeable';
import Button from '../button/button.jsx';
import Icon from '../icon';

const THROTTLE_INTERVAL_TIME = 100;

const TickPicker = ({
    default_value,
    is_submit_disabled,
    min_value,
    max_value,
    onSubmit,
    submit_label,
    singular_label,
    plural_label,
    onValueChange,
}) => {
    const normalizedTick = tick => `${tick}`.padStart(2, 0);
    const [tick_value, setTickValue] = React.useState(parseInt(default_value));

    const handleDecrease = () => {
        if (tick_value - 1 >= min_value) {
            setTickValue(tick_value - 1);
        }
    };
    const handleIncrease = () => {
        if (tick_value + 1 <= max_value) {
            setTickValue(tick_value + 1);
        }
    };
    const handleClick = () => {
        onSubmit({
            target: {
                value: tick_value,
                name: 'submit',
            },
        });
    };

    React.useEffect(() => {
        if (onValueChange) onValueChange(tick_value);
    }, [tick_value]);

    const throttledSwipeHandler = throttle(
        ({ dir }) => {
            if (dir.toLowerCase() === 'up') {
                handleIncrease();
            }
            if (dir.toLowerCase() === 'down') {
                handleDecrease();
            }
        },
        THROTTLE_INTERVAL_TIME,
        { trailing: true, leading: false }
    );

    const swipe_handlers = useSwipeable({
        onSwiping: throttledSwipeHandler,
    });

    return (
        <div className='dc-tick-picker'>
            <div className='dc-tick-picker__calculation'>
                <Button rounded className='operator' onClick={handleDecrease}>
                    <Icon icon='IcMinus' custom_color='var(--text-prominent)' />
                </Button>
                <div className='dc-tick-picker__holder' {...swipe_handlers}>
                    <span className='dc-tick-picker__holder--large'>{normalizedTick(tick_value)}</span>
                    <span className='dc-tick-picker__holder--small'>
                        {tick_value === 1 ? singular_label : plural_label}
                    </span>
                </div>
                <Button rounded className='operator' onClick={handleIncrease}>
                    <Icon icon='IcAdd' custom_color='var(--text-prominent)' />
                </Button>
            </div>
            <div
                className={classNames('dc-tick-picker__submit-wrapper', {
                    'dc-tick-picker__submit-wrapper--is-disabled': is_submit_disabled,
                })}
            >
                <Button rounded onClick={handleClick}>
                    {submit_label}
                </Button>
            </div>
        </div>
    );
};

export default TickPicker;
