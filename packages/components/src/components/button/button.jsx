import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ButtonLoading from './button_loading.jsx';
import Icon from '../icon';

const ButtonGroup = ({ children }) => <div className='btn__group'>{children}</div>;

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
    large,
    medium,
    onClick,
    tabIndex,
    text,
    wrapperClassName,
    type,
    primary,
    secondary,
    small,
    tertiary,
}) => {
    const classes = classNames(
        'btn',
        {
            btn__effect: has_effect,
            'btn--primary': primary,
            'btn--secondary': secondary,
            'btn--tertiary': tertiary,
            'btn--green': green,
            btn__large: large,
            btn__medium: medium,
            btn__small: small,
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
        >
            {icon && <div className='btn__icon'>{icon}</div>}
            {text && !(is_loading || is_submit_success) && (
                <span className={classNames('btn__text', classNameSpan)}>{text[0].toUpperCase() + text.substr(1)}</span>
            )}
            {is_loading && <ButtonLoading />}
            {is_submit_success && <Icon icon='IcCheckmark' color='active' size={24} />}
            {!text && children && <span className={classNames('btn__text', classNameSpan)}>{children}</span>}
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
    secondary: PropTypes.bool,
    small: PropTypes.bool,
    tertiary: PropTypes.bool,
    text: PropTypes.string,
    wrapperClassName: PropTypes.string,
};

Button.Group = ButtonGroup;

export default Button;
