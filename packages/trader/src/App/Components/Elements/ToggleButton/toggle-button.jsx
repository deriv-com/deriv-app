import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import { Button } from 'deriv-components';

const ToggleButton = ({
    children,
    className,
    is_disabled,
    is_selected,
    onChange,
    onClick,
    value,
    ...others
}) => {
    const handleChange = (e) => {
        if (onClick) {
            onClick(e, value);
            if (e.isDefaultPrevented()) {
                return;
            }
        }

        if (onChange) {
            onChange(e, value);
        }
    };

    return (
        <Button
            className={classNames('toggle-button', { 'toggle-button--selected': is_selected }, className)}
            is_disabled={is_disabled}
            onClick={handleChange}
            {...others}
        >
            {children}
        </Button>
    );
};

ToggleButton.propTypes = {
    children   : PropTypes.node.isRequired,
    className  : PropTypes.string,
    is_disabled: PropTypes.bool,
    is_selected: PropTypes.bool,
    onChange   : PropTypes.func,
    onClick    : PropTypes.func,
    value      : PropTypes.any.isRequired,
};

ToggleButton.defaultProps = {
    is_disabled: false,
};

export default ToggleButton;
