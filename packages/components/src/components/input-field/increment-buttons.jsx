import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button';
import Icon from '../icon';

const IncrementButtons = ({
    decrementValue,
    id,
    incrementValue,
    max_is_disabled,
    min_is_disabled,
    is_incrementable_on_long_press,
    onLongPressEnd,
    type,
}) => {
    const interval_ref = React.useRef();
    const timeout_ref = React.useRef();
    const is_long_press_ref = React.useRef();

    const handleButtonPress = onChange => ev => {
        timeout_ref.current = setTimeout(() => {
            is_long_press_ref.current = true;
            let step = 1;
            onChange(ev, step);
            interval_ref.current = setInterval(() => {
                onChange(ev, ++step);
            }, 50);
        }, 300);
    };

    const handleButtonRelease = () => {
        clearInterval(interval_ref.current);
        clearTimeout(timeout_ref.current);

        if (onLongPressEnd && is_long_press_ref.current) onLongPressEnd();

        is_long_press_ref.current = false;
    };

    const getPressEvents = onChange => {
        if (!is_incrementable_on_long_press) return {};
        return {
            onContextMenu: e => e.preventDefault(),
            onTouchStart: handleButtonPress(onChange),
            onTouchEnd: handleButtonRelease,
            onMouseDown: handleButtonPress(onChange),
            onMouseUp: handleButtonRelease,
        };
    };

    return (
        <React.Fragment>
            <Button
                id={`${id}_add`}
                className={'dc-input-wrapper__button dc-input-wrapper__button--increment'}
                is_disabled={max_is_disabled}
                onClick={incrementValue}
                tabIndex='-1'
                aria-label={'Increment value'}
                type={type}
                {...getPressEvents(incrementValue)}
            >
                <Icon
                    icon='IcAdd'
                    className={'dc-input-wrapper__icon dc-input-wrapper__icon--plus'}
                    color={max_is_disabled ? 'disabled' : undefined}
                />
            </Button>
            <Button
                id={`${id}_sub`}
                className={'dc-input-wrapper__button dc-input-wrapper__button--decrement'}
                is_disabled={min_is_disabled}
                onClick={decrementValue}
                tabIndex='-1'
                aria-label={'Decrement value'}
                type={type}
                {...getPressEvents(decrementValue)}
            >
                <Icon
                    icon='IcMinus'
                    className={'dc-input-wrapper__icon dc-input-wrapper__icon--minus'}
                    color={min_is_disabled ? 'disabled' : undefined}
                />
            </Button>
        </React.Fragment>
    );
};

IncrementButtons.propTypes = {
    decrementValue: PropTypes.func,
    id: PropTypes.string,
    incrementValue: PropTypes.func,
    onLongPressEnd: PropTypes.func,
    is_incrementable_on_long_press: PropTypes.bool,
    max_is_disabled: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    min_is_disabled: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    type: PropTypes.string,
};

export default IncrementButtons;
