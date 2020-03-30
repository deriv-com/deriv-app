import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'Components/icon';

const Button = ({ children, className, is_disabled, is_hidden, icon, label, onClick }) => (
    <>
        {!is_hidden && (
            <span
                className={classNames('dc-calendar__btn', className, {
                    'dc-calendar__btn--disabled': is_disabled,
                })}
                onClick={onClick}
            >
                {label}
                {icon && (
                    <Icon icon={icon} className='dc-calendar__icon' color={is_disabled ? 'disabled' : undefined} />
                )}
                {children}
            </span>
        )}
    </>
);

Button.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
    className: PropTypes.string,
    icon: PropTypes.string,
    is_disabled: PropTypes.bool,
    is_hidden: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
};

export default Button;
