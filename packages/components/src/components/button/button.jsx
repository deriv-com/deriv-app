import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ButtonLoading from './button_loading.jsx';
import Icon from '../icon';

const ButtonGroup = ({ children, className }) => (
    <div className={classNames('dc-btn__group', className)}>{children}</div>
);

const Button = ({
    children,
    className = '',
    classNameSpan,
    green,
    has_effect,
    icon,
    id,
    is_disabled,
    is_loading,
    is_submit_success,
    is_button_toggle,
    large,
    medium,
    onClick,
    rounded,
    tabIndex,
    text,
    wrapperClassName,
    type,
    primary,
    secondary,
    small,
    tertiary,
    ...props
}) => {
    const classes = classNames(
        'dc-btn',
        {
            'dc-btn__effect': has_effect,
            'dc-btn--primary': primary,
            'dc-btn--secondary': secondary,
            'dc-btn--tertiary': tertiary,
            'dc-btn--green': green,
            'dc-btn__rounded': rounded,
            'dc-btn__large': large,
            'dc-btn__medium': medium,
            'dc-btn__small': small,
            'dc-btn__toggle': is_button_toggle,
        },
        className
    );
    const button = (
        <button
            id={id}
            className={classes}
            onClick={onClick || undefined}
            disabled={is_disabled}
            tabIndex={tabIndex || '0'}
            type={is_submit_success ? 'button' : type || 'submit'}
            {...props}
        >
            {icon && <div className='dc-btn__icon'>{icon}</div>}
            {text && !(is_loading || is_submit_success) && (
                <span className={classNames('dc-btn__text', classNameSpan)}>
                    {text[0].toUpperCase() + text.substr(1)}
                </span>
            )}
            {is_loading && <ButtonLoading />}
            {is_submit_success && <Icon icon='IcCheckmark' color='active' size={24} />}
            {!text && children && <span className={classNames('dc-btn__text', classNameSpan)}>{children}</span>}
        </button>
    );
    const wrapper = <div className={wrapperClassName}>{button}</div>;

    return wrapperClassName ? wrapper : button;
};

Button.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    classNameSpan: PropTypes.string,
    green: PropTypes.bool,
    has_effect: PropTypes.bool,
    icon: PropTypes.node,
    id: PropTypes.string,
    is_disabled: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    is_loading: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    is_submit_success: PropTypes.bool,
    large: PropTypes.bool,
    medium: PropTypes.bool,
    onClick: PropTypes.func,
    primary: PropTypes.bool,
    rounded: PropTypes.bool,
    secondary: PropTypes.bool,
    small: PropTypes.bool,
    tertiary: PropTypes.bool,
    text: PropTypes.string,
    wrapperClassName: PropTypes.string,
};

Button.Group = ButtonGroup;

export default Button;
