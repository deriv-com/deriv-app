import classNames from 'classnames';
import React      from 'react';
import PropTypes  from 'prop-types';

const available_modes = [
    'default',
    'success',
    'warn',
    'danger',
    'info',
    'success-invert',
    'warn-invert',
];

const available_sizes = [
    'regular',
    'large',
];

const Label = ({ mode, children, size = 'regular', className }) => {
    const type = available_modes.some(m => m === mode) ? mode : 'default';
    const scale = available_sizes.some(s => s === size) ? size : 'regular';

    return (
        <span className={classNames('dc-label', className, {
            [`dc-label--${scale}`]: scale,
            [`dc-label--${type}`] : type,
        })}
        >{children}
        </span>
    );
};

Label.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    mode: PropTypes.oneOf(available_modes),
};

export default Label;
