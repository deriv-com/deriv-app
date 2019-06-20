import classNames from 'classnames';
import React      from 'react';
import PropTypes  from 'prop-types';

const available_modes = [
    'default',
    'success',
    'warn',
    'danger',
    'info',
];

const Label = ({ mode, children }) => {
    const type = available_modes.some(m => m === mode) ? mode : 'default';

    return (
        <span className={classNames('label', {
            [`label--${type}`]: type,
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
